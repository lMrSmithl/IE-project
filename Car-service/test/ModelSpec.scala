
import org.scalatest.concurrent.ScalaFutures
import org.scalatestplus.play._
import org.scalatestplus.play.guice.GuiceOneAppPerSuite

class ModelSpec extends PlaySpec with GuiceOneAppPerSuite with ScalaFutures {
  import models._

  def carService: CarRepository = app.injector.instanceOf(classOf[CarRepository])
  def companyService: CompanyRepository = app.injector.instanceOf(classOf[CompanyRepository])
  def userService: UserRepository = app.injector.instanceOf(classOf[UserRepository])

  "Car model" should {

    "be retrieved by id" in {
      whenReady(carService.findById("1ba5fc4a44cc469797fa460ae8fb3541")) { maybeCar =>
        val golf = maybeCar.get

        golf.model must equal("Golf")
        golf.brand must equal("Volkswagen")
        golf.generation must equal("VI")
        golf.prod_year must equal("2009")
        golf.body must equal("compact")
        golf.fuel must equal("gasoline")
        golf.mileage must equal("163 000")
        golf.engine must equal("1.6")
        golf.gearbox must equal("manual")
        golf.color must equal("black")
        golf.price must equal(Some(22500))
        golf.company_id must equal("3ba5fc4a44cc469797fa460ae8fb3547")
        golf.status must equal("used")
      }
    }
    
    "be listed along its cars" in {
        whenReady(carService.list()) { cars =>

          cars.length must equal(30)
        }
    }

    "be listed along company's cars" in {
      whenReady(carService.listCompanyCars("3ba5fc4a44cc469797fa460ae8fb3549")) { cars =>

        cars.length must equal(3)
      }
    }

    "be inserted new car" in {
      carService.insert(Car(Some("31a5fc4a44cc469797fa460ae8fb3541"), "Golf", "Volkswagen", "IV", "2009", "compact", "gasoline", "163 000", "1.6", "manual", "black", Some(22500), "3ba5fc4a44cc469797fa460ae8fb3547", "used"))
      whenReady(carService.findById("31a5fc4a44cc469797fa460ae8fb3541")) { maybeCar =>
        val golf = maybeCar.get

        golf.model must equal("Golf")
        golf.brand must equal("Volkswagen")
        golf.generation must equal("IV")
        golf.prod_year must equal("2009")
        golf.body must equal("compact")
        golf.fuel must equal("gasoline")
        golf.mileage must equal("163 000")
        golf.engine must equal("1.6")
        golf.gearbox must equal("manual")
        golf.color must equal("black")
        golf.price must equal(Some(22500))
        golf.company_id must equal("3ba5fc4a44cc469797fa460ae8fb3547")
        golf.status must equal("used")
      }
      whenReady(carService.list()){cars =>

        cars.length must equal(31)
      }
    }

    "be updated if needed" in {
      whenReady(carService.update("31a5fc4a44cc469797fa460ae8fb3541", Car(Some("1ba5fc4a44cc469797fa460ae8fb3541"), "Passat", "Volkswagen", "VI", "2009", "compact", "gasoline", "163 000", "1.6", "manual", "black", Some(22500), "3ba5fc4a44cc469797fa460ae8fb3547", "used"))) {_ =>
        whenReady(carService.findById("31a5fc4a44cc469797fa460ae8fb3541")) { maybeCar =>
          val passat = maybeCar.get

          passat.model must equal("Passat")
          passat.brand must equal("Volkswagen")
          passat.generation must equal("VI")
          passat.prod_year must equal("2009")
          passat.body must equal("compact")
          passat.fuel must equal("gasoline")
          passat.mileage must equal("163 000")
          passat.engine must equal("1.6")
          passat.gearbox must equal("manual")
          passat.color must equal("black")
          passat.price must equal(Some(22500))
          passat.company_id must equal("3ba5fc4a44cc469797fa460ae8fb3547")
          passat.status must equal("used")
        }
      }
    }

    "be deleted a car" in {
      whenReady(carService.delete("31a5fc4a44cc469797fa460ae8fb3541")){_ =>
        whenReady(carService.list()){cars =>
          cars.length must equal(30)
        }
      }
    }
  }

  "User model" should {
    "be retrieved by id" in {
      whenReady(userService.findById("1ba5fc4a44cc469797fa460ae8fb3540")) { maybeUser =>
        val admin = maybeUser.get

        admin.login must equal("admin")
        admin.password must equal("rty")
      }
    }

    "be retrieved by login and password" in {
      val maybeUser = userService.findByLogin("admin", "rty")
      val admin = maybeUser.get

      admin.login must equal("admin")
      admin.password must equal("rty")
    }

    "be inserted new user" in {
      userService.insert(User( Some("1ba5fc4a44cc469797fa460ae8fb3541"),"test","testpassword"))
      whenReady(userService.findById("1ba5fc4a44cc469797fa460ae8fb3541")) { maybeUser =>
        val testUser = maybeUser.get

        testUser.login must equal("test")
        testUser.password must equal("testpassword")
      }
    }

    "be updated if needed" in {
      whenReady(userService.update("1ba5fc4a44cc469797fa460ae8fb3541", User( Some("1ba5fc4a44cc469797fa460ae8fb3541"),"testlogin","testpassword"))) {_ =>
        whenReady(userService.findById("1ba5fc4a44cc469797fa460ae8fb3541")) { maybeUser =>
          val testUser = maybeUser.get

          testUser.login must equal("testlogin")
          testUser.password must equal("testpassword")
        }
      }
    }

    "be deleted a user" in {
      whenReady(userService.delete("1ba5fc4a44cc469797fa460ae8fb3541")){_ =>
        whenReady(userService.findById("1ba5fc4a44cc469797fa460ae8fb3541")) { maybeUser =>
          maybeUser must equal(None)
        }
      }
    }
  }

  "Company model" should {
    "be retrieved by id" in {
      whenReady(companyService.findById("3ba5fc4a44cc469797fa460ae8fb3542")) { maybeCompany =>
        val fastCar = maybeCompany.get

        fastCar.company_name must equal("FastCar")
        fastCar.email_address must equal("fastcar@mailsystem.com")
        fastCar.phone_number must equal("720345621")
      }
    }

    "be listed along its companies" in {
      whenReady(companyService.list()) { companies =>

        companies.length must equal(8)
      }
    }

    "be inserted new company" in {
      companyService.insert(Company( Some("2ba5fc4a44cc469797fa460ae8fb3541"),"TestCar","testcar@mailsystem.com","720345621"))
      whenReady(companyService.findById("2ba5fc4a44cc469797fa460ae8fb3541")) { maybeCompany =>
        val testCar = maybeCompany.get

        testCar.company_name must equal("TestCar")
        testCar.email_address must equal("testcar@mailsystem.com")
        testCar.phone_number must equal("720345621")
      }
      whenReady(companyService.list()) { companies =>

        companies.length must equal(9)
      }
    }

    "be updated if needed" in {
      whenReady(companyService.update("2ba5fc4a44cc469797fa460ae8fb3541", Company( Some("2ba5fc4a44cc469797fa460ae8fb3541"),"CarTest","testcar@mailsystem.com","720345621"))) {_ =>
        whenReady(companyService.findById("2ba5fc4a44cc469797fa460ae8fb3541")) { maybeCompany =>
          val testCar = maybeCompany.get

          testCar.company_name must equal("CarTest")
          testCar.email_address must equal("testcar@mailsystem.com")
          testCar.phone_number must equal("720345621")
        }
      }
    }

    "be deleted a company" in {
      whenReady(companyService.delete("2ba5fc4a44cc469797fa460ae8fb3541")){_ =>
        whenReady(companyService.list()){companies =>
          companies.length must equal(8)
        }
      }
    }
  }
}
