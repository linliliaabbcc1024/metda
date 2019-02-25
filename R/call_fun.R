call_fun = function (parameters, ...) {
  save(parameters, file = "local.RData")
  parameter_names = names(parameters)
  for (i in 1:length(parameters)) {
    assign(parameter_names[i], parameters[[parameter_names[i]]])
  }
  fileName = paste0("https://tempusername:temppassword@metda.fiehnlab.ucdavis.edu/db/rscript/rscript/", 
                    fun_name, ".R")
  eval(parse(text = readr::read_file(fileName)))
  return(result)
}
