package models

import javax.inject.Inject

import anorm._
import anorm.SqlParser.{get, str}
import play.api.db.DBApi
import play.api.libs.json.{Json, OFormat}

import scala.concurrent.Future

case class Company(
                    id: Option[String],
                    company_name: String,
                    email_address: String,
                    phone_number: String)

object Company{
  implicit val CompanyFormat: OFormat[Company] = Json.format[Company]

  implicit def toParameters: ToParameterList[Company] =
    Macro.toParameters[Company]

  val parser: RowParser[Company] = {
    get[Option[String]]("company.id") ~
      get[String]("company.company_name") ~
      get[String]("company.email_address") ~
      get[String]("company.phone_number") map {
      case id ~ company_name ~ email_address ~ phone_number =>
        Company(id, company_name, email_address, phone_number)
    }
  }
}

@javax.inject.Singleton
class CompanyRepository @Inject()(dbapi: DBApi)(implicit ec: DatabaseExecutionContext) {

  private val db = dbapi.database("default")

  /**
    * Parse a Company from a ResultSet
    */
  private[models] val simple = {
    get[Option[String]]("company.id") ~ str("company.company_name") ~ str("company.email_address") ~ str("company.phone_number") map {
      case id ~ company_name ~ email_address ~ phone_number => Company(id, company_name, email_address, phone_number)
    }
  }

  /**
   * Retrieve a company from the id.
   */
  def findById(id: String): Future[Option[Company]] = Future {
    db.withConnection { implicit connection =>
      SQL"select * from company where id = $id".as(simple.singleOpt)
    }
  }(ec)

  /**
   * Return a list of Company.
   *
   * @param filter Filter applied on the name column
   */
  def list(filter: String = "%"): Future[List[Company]] = Future {

    db.withConnection { implicit connection =>
      val companies: List[Company] = SQL"""
        select * from company
        where company.company_name like $filter or company.email_address like $filter or company.phone_number like $filter
      """.as(simple.*)
      companies
    }
  }(ec)

  /**
   * Update a company.
   *
   * @param id The company id
   * @param company The company values.
   */
  def update(id: String, company: Company): Future[Int] = Future {
    db.withConnection { implicit connection =>
      SQL"""
        update company set company_name = ${company.company_name}, email_address = ${company.email_address}, phone_number = ${company.phone_number}
        where id like $id
      """.executeUpdate()
    }
  }(ec)

  /**
   * Insert a new company.
   *
   * @param company The company values.
   */
  def insert(company: Company): Unit = {
    db.withTransaction { implicit connection =>
      connection.setAutoCommit(true)
      try {
        SQL(
          """
            insert into company (id, company_name, email_address, phone_number) values ( {id}, {company_name}, {email_address}, {phone_number});
          """).on(
          "id" -> company.id,
          "company_name" -> company.company_name,
          "email_address" -> company.email_address,
          "phone_number" -> company.phone_number
        ).executeInsert()
      } catch {
        case e: Throwable => sys.error("Error while inserting Company into database: " + e)
      }
    }
  }

  /**
   * Delete a company.
   *
   * @param id Id of the company to delete.
   */
  def delete(id: String): Future[Int] = Future {
    db.withConnection { implicit connection =>
      SQL"delete from company where id = $id".executeUpdate()
    }
  }(ec)
}
