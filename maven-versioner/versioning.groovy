static main(args) {
  if (args.length != 2) {
    println 'Expected two arguments: [project root directory] [target version]'
    System.exit(1)
  }
  def path = args[0] == '.' ? '' : args[0]
  def version = args[1]
  File pom = new File(path + 'pom.xml')
  if (!pom.exists()) {
    println pom.absolutePath + ' doesn\'t exist'
    System.exit(2)
  }

  def is = new FileInputStream(pom)
  def contents = is.text
  def edited = contents.replaceFirst(/<version>[0-9a-zA-Z.-]*<\/version>/,
    '<version>' + version + '</version>')

  pom.delete()
  pom << edited
  println 'Project now indicating version ' + version
}