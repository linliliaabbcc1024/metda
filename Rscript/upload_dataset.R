

  dta = from_path_to_data(path)

  e= dta$e
  p= dta$p
  f= dta$f
  data_matrix= dta$data_matrix




  if(project_id == "going_to_upload_dataset_to_database"){
    p = 1
    f = 1

  }else{
    fwrite(data.table(e),"temp_e.csv")
    data.matrix(fread("temp_e.csv"))

    projectUrl <- URLencode(paste0("http://slfan:metabolomics@metda.fiehnlab.ucdavis.edu/db/project/",project_id))
    projectList <- jsonlite::fromJSON(projectUrl)
    attname = "temp_e.csv"
    new_att = projectList[["_attachments"]]
    new_att = new_att[!names(new_att)%in%attname]
    new_att[[attname]] = list(content_type="application/vnd.ms-excel", data = RCurl::base64Encode(readBin('temp_e.csv', "raw", file.info('temp_e.csv')[1, "size"]), "txt"))
    projectList[["_attachments"]] = new_att

    result = RCurl::getURL(projectUrl,customrequest='PUT',httpheader=c('Content-Type'='application/json'),postfields= jsonlite::toJSON(projectList,auto_unbox = T, force = T))
  }



  result = list(
    p = p,
    f = f,
    e = 1,
    data_matrix = data_matrix[1:min(nrow(data_matrix),200),1:min(ncol(data_matrix),200)],
    project_id=project_id
  )