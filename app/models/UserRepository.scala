package models

import javax.inject.Inject
import anorm.SqlParser.get
import anorm._
import play.api.db.DBApi
import play.api.libs.json.{Json, OFormat}

import scala.concurrent.Future

case class User(
                 id: Option[String],
                 login: String,
                 password: String,
               )

object User {
  implicit def toParameters: ToParameterList[User] =
    Macro.toParameters[User]

  implicit val UserFormat: OFormat[User] = Json.format[User]

  val parser: RowParser[User] = {
    get[Option[String]]("user.id") ~
      get[String]("user.login") ~
      get[String]("user.password") map {
      case id ~ login ~ password =>
        User(id, login, password)
    }
  }
}

@javax.inject.Singleton
class UserRepository @Inject()(dbapi: DBApi)(implicit ec: DatabaseExecutionContext) {

  private val db = dbapi.database("default")

  /**
   * Parse a User from a ResultSet
   */
  private val simple = {
    get[Option[String]]("user.id") ~
      get[String]("user.login") ~
      get[String]("user.password") map {
      case id ~ login ~ password =>
        User(id, login, password)
    }
  }

  /**
   * Retrieve a user from the id.
   */
  def findById(id: String): Future[Option[User]] = Future {
    db.withConnection { implicit connection =>
      SQL"select * from user where id = $id".as(simple.singleOpt)
    }
  }(ec)

  /**
   * Retrieve a user from the login.
   *
   * @param login User login
   * @param password User password
   */
  def findByLogin(login: String, password:String): Option[User] = {
    db.withConnection { implicit connection =>
      val user =
        SQL"""
        select * from user
        where user.login like $login and user.password like $password
        """.as(simple.singleOpt)
      user
    }
  }

  /**
   * Insert a new user.
   *
   * @param user The user values.
   */
  def insert(user: User): Unit = {
    db.withTransaction { implicit connection =>
      connection.setAutoCommit(true)
      try {
        SQL(
          """
        insert into user (id, login, password) values ( {id}, {login}, {password});
      """).on(
          "id" -> user.id,
          "login" -> user.login,
          "password" -> user.password
        ).executeInsert()
      } catch {
        case e: Throwable => sys.error("Error while inserting User into database: " + e)
      }
    }
  }

  /**
   * Update a user.
   *
   * @param id   The user id
   * @param user The user values.
   */
  def update(id: String, user: User): Future[Int] = Future {
    db.withConnection { implicit connection =>
      SQL"""
        update user set login = ${user.login}, password = ${user.password}
        where id like $id
      """.executeUpdate()
    }
  }(ec)

  /**
   * Delete a user.
   *
   * @param id Id of the user to delete.
   */
  def delete(id: String): Future[Int] = Future {
    db.withConnection { implicit connection =>
      SQL"delete from user where id = $id".executeUpdate()
    }
  }(ec)
}