package models

import javax.inject.Inject
import anorm.SqlParser.get
import anorm._
import play.api.db.DBApi
import play.api.libs.json.{Json, OFormat}

import scala.concurrent.Future

case class Car(id: Option[String],
               model: String,
               brand: String,
               generation: String,
               prod_year: String,
               body: String,
               fuel: String,
               mileage: String,
               engine: String,
               gearbox: String,
               color: String,
               price: Option[Long],
               company_id: String,
               status: String)

object Car {
  implicit def toParameters: ToParameterList[Car] =
    Macro.toParameters[Car]

  implicit val CarFormat: OFormat[Car] = Json.format[Car]

  val parser: RowParser[Car] = {
    get[Option[String]]("car.id") ~
      get[String]("car.model") ~
      get[String]("car.brand") ~
      get[String]("car.generation") ~
      get[String]("car.prod_year") ~
      get[String]("car.body") ~
      get[String]("car.fuel") ~
      get[String]("car.mileage") ~
      get[String]("car.engine") ~
      get[String]("car.gearbox") ~
      get[String]("car.color") ~
      get[Option[Long]]("car.price") ~
      get[String]("car.company_id") ~
      get[String]("car.status") map {
      case id ~ model ~ brand ~ generation ~ prod_year ~ body ~ fuel ~ mileage ~ engine ~ gearbox ~ color ~ price ~ company_id ~ status =>
        Car(id, model, brand, generation, prod_year, body, fuel, mileage, engine, gearbox, color, price, company_id, status)
    }
  }
}

@javax.inject.Singleton
class CarRepository @Inject()(dbapi: DBApi, companyRepository: CompanyRepository)(implicit ec: DatabaseExecutionContext) {

  private val db = dbapi.database("default")

  // -- Parsers

  /**
   * Parse a Car from a ResultSet
   */
  private val simple = {
    get[Option[String]]("car.id") ~
      get[String]("car.model") ~
      get[String]("car.brand") ~
      get[String]("car.generation") ~
      get[String]("car.prod_year") ~
      get[String]("car.body") ~
      get[String]("car.fuel") ~
      get[String]("car.mileage") ~
      get[String]("car.engine") ~
      get[String]("car.gearbox") ~
      get[String]("car.color") ~
      get[Option[Long]]("car.price") ~
      get[String]("car.company_id") ~
      get[String]("car.status") map {
      case id ~ model ~ brand ~ generation ~ prod_year ~ body ~ fuel ~ mileage ~ engine ~ gearbox ~ color ~ price ~ company_id ~ status =>
        Car(id, model, brand, generation, prod_year, body, fuel, mileage, engine, gearbox, color, price, company_id, status)
    }
  }

  // -- Queries

  /**
   * Retrieve a car from the id.
   */
  def findById(id: String): Future[Option[Car]] = Future {
    db.withConnection { implicit connection =>
      SQL"select * from car where id = $id".as(simple.singleOpt)
    }
  }(ec)

  /**
   * Return a list of Cars.
   *
   * @param filter Filter applied on the name column
   */
  def list(filter: String = "%"): Future[List[Car]] = Future {

    db.withConnection { implicit connection =>
      val cars: List[Car] =
        SQL"""
        select * from car
        where car.model like $filter or car.brand like $filter or car.generation like $filter or car.prod_year like $filter or car.fuel like $filter or car.price like $filter or car.status like $filter or car.company_id like $filter
      """.as(simple.*)
      cars
    }
  }(ec)

  /**
   * Return a list of Company's Cars.
   *
   * @param id Filter applied on the name column
   */
  def listCompanyCars(id: String = "%"): Future[List[Car]] = Future {

    db.withConnection { implicit connection =>
      val cars: List[Car] =
        SQL"""
        select * from car
        where car.company_id like $id
      """.as(simple.*)
      cars
    }
  }(ec)

  /**
   * Update a car.
   *
   * @param id  The car id
   * @param car The car values.
   */
  def update(id: String, car: Car): Future[Int] = Future {
    db.withConnection { implicit connection =>
      SQL"""
        update car set model = ${car.model}, brand = ${car.brand}, generation = ${car.generation}, prod_year = ${car.prod_year}, body = ${car.body}, fuel = ${car.fuel}, mileage = ${car.mileage}, engine = ${car.engine}, gearbox = ${car.gearbox}, color = ${car.color}, price = ${car.price}, company_id = ${car.company_id}, status = ${car.status}
        where id like $id
      """.executeUpdate()
    }
  }(ec)

  /**
   * Insert a new car.
   *
   * @param car The car values.
   */
  def insert(car: Car): Unit = {
    db.withTransaction { implicit connection =>
      connection.setAutoCommit(true)
      try {
        SQL(
          """
            insert into car (id, model, brand, generation, prod_year, body, fuel, mileage, engine, gearbox, color,
             price, company_id, status) values ( {id}, {model}, {brand}, {generation}, {prod_year}, {body}, {fuel},
             {mileage}, {engine}, {gearbox}, {color}, {price}, {company_id}, {status});
          """).on(
          "id" -> car.id,
          "model" -> car.model,
          "brand" -> car.brand,
          "generation" -> car.generation,
          "prod_year" -> car.prod_year,
          "body" -> car.body,
          "fuel" -> car.fuel,
          "mileage" -> car.mileage,
          "engine" -> car.engine,
          "gearbox" -> car.gearbox,
          "color" -> car.color,
          "price" -> car.price,
          "company_id" -> car.company_id,
          "status" -> car.status
        ).executeInsert()
      } catch {
        case e: Throwable => sys.error("Error while inserting Car into database: " + e)
      }
    }
  }

  /**
   * Delete a car.
   *
   * @param id Id of the car to delete.
   */
  def delete(id: String): Future[Int] = Future {
    db.withConnection { implicit connection =>
      SQL"delete from car where id = $id".executeUpdate()
    }
  }(ec)

}
