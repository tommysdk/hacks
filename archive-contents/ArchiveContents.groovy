/*
 * Copyright 2012 Tommy Tynjä
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import org.jboss.shrinkwrap.api.Archive
import org.jboss.shrinkwrap.api.ShrinkWrap
import org.jboss.shrinkwrap.api.importer.ArchiveImportException
import org.jboss.shrinkwrap.api.importer.ZipImporter
import org.jboss.shrinkwrap.api.formatter.Formatters
import org.jboss.shrinkwrap.api.spec.EnterpriseArchive
import org.jboss.shrinkwrap.api.spec.JavaArchive
import org.jboss.shrinkwrap.api.spec.WebArchive

/**
 * @author Tommy Tynjä
 */
@Grab(group='org.jboss.shrinkwrap', module='shrinkwrap-api', version='1.1.0-alpha-3')
@Grab(group='org.jboss.shrinkwrap', module='shrinkwrap-impl-base', version='1.1.0-alpha-3')
@Grab(group='org.jboss.shrinkwrap', module='shrinkwrap-spi', version='1.1.0-alpha-3')
class ArchiveContents {
  static void main(String[] args) {
    if (args.length < 1) {
      println "An archive path must be specified as argument"
      System.exit 1
    }
    File path = new File(args[0])
    if (!path.isFile()) {
      println "Specified path must be a file"
      System.exit 2
    }

    Archive archive = null
    try {
      archive = ShrinkWrap.create(ZipImporter.class, "archive.ear")
              .importFrom(path)
              .as(resolveType(path.absolutePath))
    } catch (ArchiveImportException aie) {
      println aie.getMessage() + ": " + path
    }
    archive?.writeTo(System.out, Formatters.VERBOSE)
  }

  static Class resolveType(final String path) {
    if (path.endsWith(".ear")) return EnterpriseArchive.class
    else if (path.endsWith(".war")) return WebArchive.class
    else return JavaArchive.class
  }
}
