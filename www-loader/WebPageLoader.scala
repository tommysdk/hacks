/*
Resolves the size of different web pages.
Demonstrates Scala concurrency using actors.
Run with: scala WebPageLoader.scala
 */
import scala.io._
import scala.actors._
import Actor._

object WebPageLoader {
  def resolveSizeOf(url : String) = Source.fromURL(url).mkString.length
}

val urls = List(
  "http://www.yahoo.com/",
  "http://www.cnn.com/",
  "http://www.bbc.co.uk/",
  "http://www.dn.se/"
)

def pad(url : String) = {
  val longestUrl = urls.map(x => x.length).max
  url.padTo(longestUrl, " ").mkString
}

def timeMethod(method: () => Unit) = {
  val start = System.nanoTime
  method()
  val end = System.nanoTime
  println("Method took " + (end-start)/1000000000.0 + " seconds")
}

def resolvePageSizeSequentially() = {
  for(url <- urls) {
    println("Page size of " + pad(url) + ": " + WebPageLoader.resolveSizeOf(url))
  }
}

def resolvePageSizeConcurrently() = {
  val caller = self

  for(url <- urls) {
    actor { caller ! (url, WebPageLoader.resolveSizeOf(url)) }
  }

  for (i <- 1 to urls.size) {
    receive {
      case (url: String, size) => println("Page size of " + pad(url) + ": " + size)
    }
  }
}

println("Sequential run")
timeMethod { resolvePageSizeSequentially }

println("Concurrent run")
timeMethod { resolvePageSizeConcurrently }
