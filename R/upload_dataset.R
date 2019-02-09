upload_dataset <- function(path="/Users/silifan/Downloads/Frass\ only\ MetDa.xlsx",project_id="",module="") {
  save(path,file = 'local.RData')
  # load('local.RData')
  # return(TRUE)
  # dta = from_path_to_data(URLencode(path))
  if(grepl("http",path)){
    dta = from_path_to_data(URLencode(path))
  }else{
    dta = from_path_to_data(path)
  }


  e= dta$e
  p= dta$p
  f= dta$f
  data_matrix= dta$data_matrix


  if(project_id == "going_to_upload_dataset_to_database"){
    p = 1
    f = 1

  }else{
    fwrite(data.table(e),"temp_e.csv")

    projectUrl <- URLencode(paste0("http://localhost:5985/project/",project_id))
    projectList <- jsonlite::fromJSON(projectUrl)
    attname = "temp_e.csv"
    new_att = projectList[["_attachments"]]
    new_att = new_att[!names(new_att)%in%attname]
    new_att[[attname]] = list(content_type="application/vnd.ms-excel", data = RCurl::base64Encode(readBin('temp_e.csv', "raw", file.info('temp_e.csv')[1, "size"]), "txt"))
    projectList[["_attachments"]] = new_att

    result = RCurl::getURL(projectUrl,customrequest='PUT',httpheader=c('Content-Type'='application/json'),postfields= jsonlite::toJSON(projectList,auto_unbox = T, force = T))
  }

  if(!module %in% c('one_way_boxplot','idexchanger')){
    e = 1
  }

  return(list(
    p = p,
    f = f,
    e = e,
    data_matrix = data_matrix[1:min(nrow(data_matrix),200),1:min(ncol(data_matrix),200)],
    project_id=project_id
  ))

  # return(TRUE)
}
