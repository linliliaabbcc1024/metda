call_fun = function(parameters,...){

  save(parameters,file = 'local.RData')
  # load('local.RData')
  # return(TRUE)

  parameter_names = names(parameters)
  for(i in 1:length(parameters)){
    assign(parameter_names[i], parameters[[parameter_names[i]]])
  }

  # paste0("http://slfan:metabolomics@localhost:5985/project/",project_ID)
  # fileName = paste0("http://slfan:metabolomics@localhost:5985/master/",fun_name,".R")

  fileName = paste0("http://slfan:metabolomics@localhost:5985/rscript/rscript/",fun_name,".R")

  eval(parse(text=readr::read_file(fileName)))

  return(result)
}
