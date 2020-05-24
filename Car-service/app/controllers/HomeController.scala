package controllers

import javax.inject.Inject
import models._
import play.api.data.Forms._
import play.api.data._
import play.api.libs.json.{JsValue, Json}
import play.api.mvc._
import java.util.UUID.randomUUID
import play.api.Configuration
import scala.concurrent.duration._

import scala.concurrent.{Await, ExecutionContext, Future}

/**
 * Manage a database of cars
 */
class HomeController @Inject()(carService: CarRepository,
                               userService: UserRepository,
                               companyService: CompanyRepository,
                               conf:Configuration,
                               cc: MessagesControllerComponents)(implicit ec: ExecutionContext)
  extends MessagesAbstractController(cc) {

  /**
   * Describe the car form (used in both edit and create screens).
   */
  val carForm = Form(
    mapping(
      "id" -> optional(text),
      "model" -> nonEmptyText,
      "brand" -> nonEmptyText,
      "generation" -> nonEmptyText,
      "prod_year" -> nonEmptyText,
      "body" -> nonEmptyText,
      "fuel" -> nonEmptyText,
      "mileage" -> nonEmptyText,
      "engine" -> nonEmptyText,
      "gearbox" -> nonEmptyText,
      "color" -> nonEmptyText,
      "price" -> optional(longNumber),
      "company_id" -> nonEmptyText,
      "status" -> nonEmptyText,
    )(Car.apply)(Car.unapply)
  )

  /**
   * Describe the user form
   */
  val userForm = Form(
    mapping(
      "id" -> optional(text),
      "login" -> nonEmptyText,
      "password" -> nonEmptyText,
    )(User.apply)(User.unapply)
  )

  // -- Actions

  /**
   * Show all cars.
   *
   * @param filter Filter applied on car items
   */
  def list(filter: String): Action[AnyContent] = Action.async { implicit request =>
    request.session.get("key").map{ _ =>
      carService.list(filter = "%" + filter + "%").map { cars =>
        val json = Json.toJson(cars)
        Ok(json)
      }
    }.getOrElse(
      Future{
        Unauthorized("Sign In")
      }
    )
  }

  /**
   * Find car by id.
   *
   * @param id Id of the car to edit
   */
  def find(id: String): Action[AnyContent] = Action.async { implicit request =>
    request.session.get("key").map{ _ =>
      carService.findById(id).map {
        case Some(car) =>
          val json = Json.toJson(car)
          Ok(json)
        case _ =>
          val json = Json.toJson("Car not found")
          NotFound(json)
      }
    }.getOrElse(
      Future{
        Unauthorized("Sign In")
      }
    )
  }

  /**
   * Updates a car.
   *
   * @param id Id of the car to edit
   */
  def update(id: String): Action[JsValue] = Action.async(parse.json) { implicit request =>
    request.session.get("key").map{ _ =>
      request.body.validate[Car].fold(
        _ => Future.successful(BadRequest("Missing or invalid data")),
        resultCar => {
          carService.findById(id).map {
            case Some(car) =>
              val newCar = Car(Some(id), resultCar.model, resultCar.brand, resultCar.generation, resultCar.prod_year, resultCar.body, resultCar.fuel, resultCar.mileage, resultCar.engine, resultCar.gearbox, resultCar.color, resultCar.price, resultCar.company_id, resultCar.status)
              carService.update(id, newCar)
              val json = Json.toJson(newCar)
              Ok(json)
            case _ =>
              val json = Json.toJson("Car not found")
              NotFound(json)
          }
        }
      )
    }.getOrElse(
      Future{
        Unauthorized("Sign In")
      }
    )
  }

  /**
   * Add car to database.
   */
  def save: Action[JsValue] = Action.async(parse.json) { implicit request =>
    request.session.get("key").map{ _ =>
      request.body.validate[Car].fold(
        _ => Future.successful(BadRequest("Missing or invalid data")),
        resultCar => {
          Future {
            val idString: String = randomUUID().toString.replace("-", "")
            val car = Car(Some(resultCar.id.getOrElse(idString)), resultCar.model, resultCar.brand, resultCar.generation, resultCar.prod_year, resultCar.body, resultCar.fuel, resultCar.mileage, resultCar.engine, resultCar.gearbox, resultCar.color, resultCar.price, resultCar.company_id, resultCar.status)
            carService.insert(car)
            val json = Json.toJson(car)
            Created(json)
          }
        }
      )
    }.getOrElse(
      Future{
        Unauthorized("Sign In")
      }
    )
  }

  /**
   * Delete a car.
   *
   * @param id Id of the car to delete
   */
  def delete(id: String): Action[AnyContent] = Action.async { implicit request =>
    request.session.get("key").map{ _ =>
      carService.findById(id).map {
        case Some(car) =>
          carService.delete(id)
          NoContent.flashing("success" -> "Deleted")
        case _ =>
          val json = Json.toJson("Car not found")
          NotFound(json)
      }
    }.getOrElse(
      Future{
        Unauthorized("Sign In")
      }
    )
  }

  /**
   * Create user.
   */
  def createUser: Action[JsValue] = Action.async(parse.json) { implicit request =>
    request.body.validate[User].fold(
      _ => Future.successful(BadRequest("Missing or invalid data")),
      resultUser => {
        Future {
          val idString: String = randomUUID().toString.replace("-", "")
          val user = User(Some(idString), resultUser.login, resultUser.password)
          userService.insert(user)
          val json = Json.toJson(user)
          val key = user.login + "_" + user.id.getOrElse("some_id")
          Created(json).withSession("key" -> key)
        }
      }
    )
  }

  /**
   * Find user by id.
   *
   * @param id Id of the user to edit
   */
  def findUser(id: String): Action[AnyContent] = Action.async { implicit request =>
    request.session.get("key").map{ _ =>
      userService.findById(id).map {
        case Some(user) =>
          val json = Json.toJson(user)
          Ok(json)
        case _ =>
          val json = Json.toJson("User not found")
          NotFound(json)
      }
    }.getOrElse(
      Future{
        Unauthorized("Sign In")
      }
    )
  }

  /**
   * Updates a user.
   *
   * @param id Id of the car to edit
   */
  def updateUser(id: String): Action[JsValue] = Action.async(parse.json) { implicit request =>
    request.session.get("key").map{ _ =>
      request.body.validate[User].fold(
        _ => Future.successful(BadRequest("Missing or invalid data")),
        resultUser => {
          userService.findById(id).map {
            case Some(user) =>
              val newUser = User(Some(id), resultUser.login, resultUser.password)
              userService.update(id, newUser)
              val json = Json.toJson(newUser)
              Ok(json)
            case _ =>
              val json = Json.toJson("User not found")
              NotFound(json)
          }
        }
      )
    }.getOrElse(
      Future{
        Unauthorized("Sign In")
      }
    )
  }

  /**
   * Delete a user.
   *
   * @param id Id of the car to delete
   */
  def deleteUser(id: String): Action[AnyContent] = Action.async { implicit request =>
    request.session.get("key").map{ _ =>
      userService.findById(id).map {
        case Some(user) =>
          userService.delete(id)
          NoContent.flashing("success" -> "Deleted")
        case _ =>
          val json = Json.toJson("User not found")
          NotFound(json)
      }
    }.getOrElse(
      Future{
        Unauthorized("Sign In")
      }
    )
  }

  /**
   * Logs user into the system.
   */
  def login: Action[JsValue] = Action.async(parse.json) { implicit request =>
    request.body.validate[User].fold(
      _ => Future.successful(BadRequest("Missing or invalid data")),
      resultUser => {
        Future {
          val user:Option[User] = userService.findByLogin(resultUser.login, resultUser.password)
          if(user.isEmpty) {
            Unauthorized("Wrong username or password")
          }
          else{
            val json = Json.toJson(user)
            val key = user.get.login + "_" + user.get.id.getOrElse("some_id")
            Ok(json).withSession("key" -> key)
          }
        }
      }
    )
  }

  /**
   * Show all companies.
   *
   * @param filter Filter applied on company items
   */
  def listCompany(filter: String): Action[AnyContent] = Action.async { implicit request =>
    request.session.get("key").map{ _ =>
      companyService.list(filter = "%" + filter + "%").map { company =>
        val json = Json.toJson(company)
        Ok(json)
      }
    }.getOrElse(
      Future{
        Unauthorized("Sign In")
      }
    )
  }

  /**
   * Find company by id.
   *
   * @param id Id of the company
   */
  def findCompany(id: String): Action[AnyContent] = Action.async { implicit request =>
    request.session.get("key").map{ _ =>
      companyService.findById(id).map {
        case Some(company) =>
          val json = Json.toJson(company)
          Ok(json)
        case _ =>
          val json = Json.toJson("Company not found")
          NotFound(json)
      }
    }.getOrElse(
      Future{
        Unauthorized("Sign In")
      }
    )
  }

  /**
   * Updates a company.
   *
   * @param id Id of the company to edit
   */
  def updateCompany(id: String): Action[JsValue] = Action.async(parse.json) { implicit request =>
    request.session.get("key").map{ _ =>
      request.body.validate[Company].fold(
        _ => Future.successful(BadRequest("Missing or invalid data")),
        resultCompany => {
          companyService.findById(id).map {
            case Some(company) =>
              val newCompany = Company(Some(id), resultCompany.company_name, resultCompany.email_address, resultCompany.phone_number)
              companyService.update(id, newCompany)
              val json = Json.toJson(newCompany)
              Ok(json)
            case _ =>
              val json = Json.toJson("Company not found")
              NotFound(json)
          }
        }
      )
    }.getOrElse(
      Future{
        Unauthorized("Sign In")
      }
    )
  }

  /**
   * Add company to database.
   */
  def saveCompany: Action[JsValue] = Action.async(parse.json) { implicit request =>
    request.session.get("key").map{ _ =>
      request.body.validate[Company].fold(
        _ => Future.successful(BadRequest("Missing or invalid data")),
        resultCompany => {
          Future {
            val idString: String = randomUUID().toString.replace("-", "")
            val company = Company(Some(resultCompany.id.getOrElse(idString)), resultCompany.company_name, resultCompany.email_address, resultCompany.phone_number)
            companyService.insert(company)
            val json = Json.toJson(company)
            Created(json)
          }
        }
      )
    }.getOrElse(
      Future{
        Unauthorized("Sign In")
      }
    )
  }

  /**
   * Delete a company.
   *
   * @param id Id of the company to delete
   */
  def deleteCompany(id: String): Action[AnyContent] = Action.async { implicit request =>
    request.session.get("key").map{ _ =>
      companyService.findById(id).map {
        case Some(company) =>
          companyService.delete(id)
          NoContent.flashing("success" -> "Deleted").withNewSession
        case _ =>
          val json = Json.toJson("Company not found")
          NotFound(json)
      }
    }.getOrElse(
      Future{
        Unauthorized("Sign In")
      }
    )
  }

  /**
   * Find cars by company_id.
   *
   * @param id Id of the company
   */
  def showComapnyCars(id: String): Action[AnyContent] = Action.async { implicit request =>
    request.session.get("key").map{ _ =>
      companyService.findById(id).map {
        case Some(company) =>
          val tmp: Future[List[Car]] = carService.listCompanyCars(id = id).map { cars =>
            cars
          }
          val json = Json.toJson(Await.result(tmp, 10.seconds))
          Ok(json)
        case _ =>
          val json = Json.toJson("Company not found")
          NotFound(json)
      }
    }.getOrElse(
      Future{
        Unauthorized("Sign In")
      }
    )
  }

}