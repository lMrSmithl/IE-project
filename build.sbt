name := "play-scala-anorm-example"

version := "2.7.x"

scalaVersion := "2.12.8"

lazy val root = (project in file(".")).enablePlugins(PlayScala)

libraryDependencies += guice
libraryDependencies += jdbc
libraryDependencies += evolutions
libraryDependencies += ws

libraryDependencies += "com.h2database" % "h2" % "1.4.199"
libraryDependencies += "org.abstractj.kalium" % "kalium" % "0.8.0"
libraryDependencies += "com.typesafe.akka" %% "akka-distributed-data" % "2.5.23"
libraryDependencies += "org.webjars.npm" % "libsodium" % "0.7.5"
libraryDependencies += "org.scalatestplus.play" %% "scalatestplus-play" % "4.0.3" % Test

libraryDependencies += "org.playframework.anorm" %% "anorm" % "2.6.2"
libraryDependencies += "org.scalatestplus.play" %% "scalatestplus-play" % "4.0.3" % Test

ThisBuild / scalacOptions ++= List("-encoding", "utf8", "-deprecation", "-feature", "-unchecked", "-Xfatal-warnings")
ThisBuild / javacOptions ++= List("-Xlint:unchecked", "-Xlint:deprecation", "-Werror")
