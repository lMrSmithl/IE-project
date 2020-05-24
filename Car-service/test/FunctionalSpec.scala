import akka.actor.ActorSystem
import akka.stream.ActorMaterializer
import controllers.HomeController
import models._
import org.scalatest.concurrent.ScalaFutures
import play.api.test._
import play.api.test.Helpers._
import org.scalatestplus.play._
import org.scalatestplus.play.guice._
import play.api.Application
import play.api.inject.guice.GuiceApplicationBuilder
import play.api.libs.json.Json
import play.api.mvc.AnyContentAsEmpty
import play.api.test.CSRFTokenHelper._

class FunctionalSpec extends PlaySpec with GuiceOneAppPerSuite with ScalaFutures {

  def homeController: HomeController = app.injector.instanceOf(classOf[HomeController])
  def fakeRequest: FakeRequest[AnyContentAsEmpty.type] = FakeRequest()
  override def fakeApplication(): Application = {
    GuiceApplicationBuilder().configure(Map("sign" -> true)).build()
  }
  implicit val sys = ActorSystem("MyTest")
  implicit val mat = ActorMaterializer()

  "HomeController" should {

    "sign in to system" in {
      val result = homeController.login(fakeRequest.withBody(Json.toJson(User(None, "admin", "rty"))))

      status(result) must equal(OK)
    }

    "list computers on the the first page" in {
      val result = homeController.list("")(fakeRequest)

      status(result) must equal(OK)
    }

    "find car by id" in {
      val badResult = homeController.find("test")(fakeRequest)

      status(badResult) must equal(NOT_FOUND)

      val result = homeController.find("1ba5fc4a44cc469797fa460ae8fb3541")(fakeRequest)

      status(result) must equal(OK)
    }

    "add car to database" in {
      val badResult = homeController.save(fakeRequest.withBody(Json.toJson(User(Some("test"), "test", "test"))))

      status(badResult) must equal(BAD_REQUEST)

      val result = homeController.save(fakeRequest.withBody(Json.toJson(Car(Some("31a5fc4a44cc469797fa460ae8fb3541"), "Golf", "Volkswagen", "IV", "2009", "compact", "gasoline", "163 000", "1.6", "manual", "black", Some(22500), "3ba5fc4a44cc469797fa460ae8fb3547", "used"))))

      status(result) must equal(CREATED)
    }

    "updates a car" in {
      val fakeResult = homeController.update("test")(fakeRequest.withBody(Json.toJson(Car(Some("test"), "Golf", "Volkswagen", "IV", "2009", "compact", "gasoline", "163 000", "1.6", "manual", "black", Some(22500), "3ba5fc4a44cc469797fa460ae8fb3547", "used"))))

      status(fakeResult) must equal(NOT_FOUND)

      val badResult = homeController.update("31a5fc4a44cc469797fa460ae8fb3541")(fakeRequest.withBody(Json.toJson(User(Some("test"), "test", "test"))))

      status(badResult) must equal(BAD_REQUEST)

      val result = homeController.update("31a5fc4a44cc469797fa460ae8fb3541")(fakeRequest.withBody(Json.toJson(Car(Some("31a5fc4a44cc469797fa460ae8fb3541"), "Golf", "Volkswagen", "IV", "2009", "compact", "gasoline", "163 000", "1.6", "manual", "black", Some(22500), "3ba5fc4a44cc469797fa460ae8fb3547", "used"))))

      status(result) must equal(OK)
    }

    "delete a car" in {
      val badResult = homeController.delete("test")(fakeRequest)

      status(badResult) must equal(NOT_FOUND)

      val result = homeController.delete("31a5fc4a44cc469797fa460ae8fb3541")(fakeRequest)

      status(result) must equal(NO_CONTENT)
    }

    "create user" in {
      val badResult = homeController.createUser(fakeRequest.withBody(Json.toJson(Car(Some("31a5fc4a44cc469797fa460ae8fb3541"), "Golf", "Volkswagen", "IV", "2009", "compact", "gasoline", "163 000", "1.6", "manual", "black", Some(22500), "3ba5fc4a44cc469797fa460ae8fb3547", "used"))))

      status(badResult) must equal(BAD_REQUEST)

      val result = homeController.createUser(fakeRequest.withBody(Json.toJson(User(Some("2ba5fc4a44cc469797fa460ae8fb3540"),"test","test"))))

      status(result) must equal(CREATED)
    }

    "find user by id" in {
      val badResult = homeController.findUser("test")(fakeRequest)

      status(badResult) must equal(NOT_FOUND)

      val result = homeController.findUser("2ba5fc4a44cc469797fa460ae8fb3540")(fakeRequest)

      status(result) must equal(OK)
    }

    "updates a user" in {
      val fakeResult = homeController.updateUser("test")(fakeRequest.withBody(Json.toJson(User(Some("test"), "test", "test"))))

      status(fakeResult) must equal(NOT_FOUND)

      val badResult = homeController.updateUser("2ba5fc4a44cc469797fa460ae8fb3540")(fakeRequest.withBody(Json.toJson(Company(Some("test"), "test", "test","test"))))

      status(badResult) must equal(BAD_REQUEST)

      val result = homeController.updateUser("2ba5fc4a44cc469797fa460ae8fb3540")(fakeRequest.withBody(Json.toJson(User(Some("test"), "test", "test"))))

      status(result) must equal(OK)
    }

    "delete a user" in {
      val badResult = homeController.deleteUser("test")(fakeRequest)

      status(badResult) must equal(NOT_FOUND)

      val result = homeController.deleteUser("2ba5fc4a44cc469797fa460ae8fb3540")(fakeRequest)

      status(result) must equal(NO_CONTENT)
    }

    "show all companies" in {
      val result = homeController.listCompany("")(fakeRequest)

      status(result) must equal(OK)
    }

    "find company by id" in {
      val badResult = homeController.findCompany("test")(fakeRequest)

      status(badResult) must equal(NOT_FOUND)

      val result = homeController.findCompany("3ba5fc4a44cc469797fa460ae8fb3542")(fakeRequest)

      status(result) must equal(OK)
    }

    "add company to database" in {
      val badResult = homeController.saveCompany(fakeRequest.withBody(Json.toJson(Car(Some("31a5fc4a44cc469797fa460ae8fb3541"), "Golf", "Volkswagen", "IV", "2009", "compact", "gasoline", "163 000", "1.6", "manual", "black", Some(22500), "3ba5fc4a44cc469797fa460ae8fb3547", "used"))))

      status(badResult) must equal(BAD_REQUEST)

      val result = homeController.saveCompany(fakeRequest.withBody(Json.toJson(Company(Some("3ba5fc4a44cc469797fa460ae8fb3541"),"test","test","test"))))

      status(result) must equal(CREATED)
    }

    "updates a company" in {
      val fakeResult = homeController.updateCompany("test")(fakeRequest.withBody(Json.toJson(Company(Some("3ba5fc4a44cc469797fa460ae8fb3541"),"test","test","test"))))

      status(fakeResult) must equal(NOT_FOUND)

      val badResult = homeController.updateCompany("3ba5fc4a44cc469797fa460ae8fb3541")(fakeRequest.withBody(Json.toJson(User(Some("test"), "test", "test"))))

      status(badResult) must equal(BAD_REQUEST)

      val result = homeController.updateCompany("3ba5fc4a44cc469797fa460ae8fb3541")(fakeRequest.withBody(Json.toJson(Company(Some("3ba5fc4a44cc469797fa460ae8fb3541"),"test","test","test"))))

      status(result) must equal(OK)
    }

    "delete a company" in {
      val badResult = homeController.deleteCompany("test")(fakeRequest)

      status(badResult) must equal(NOT_FOUND)

      val result = homeController.deleteCompany("3ba5fc4a44cc469797fa460ae8fb3541")(fakeRequest)

      status(result) must equal(NO_CONTENT)
    }

    "find cars by company_id" in {
      val badResult = homeController.showComapnyCars("test")(fakeRequest)

      status(badResult) must equal(NOT_FOUND)

      val result = homeController.showComapnyCars("3ba5fc4a44cc469797fa460ae8fb3542")(fakeRequest)

      status(result) must equal(OK)
    }
  }
}
