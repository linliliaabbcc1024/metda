
  pacman::p_load(data.table,stringr)

  # save(path,file="local.RData")
  # load("local.RData")



  obj = upload_dataset(path,project_id=project_id)
  # fwrite(data.table(obj$e),"temp_e.csv")
  # data.matrix(fread("temp_e.csv"))
  #
  #
  # projectUrl <- URLencode(paste0("http://slfan:metabolomics@metda.fiehnlab.ucdavis.edu/db/project/",project_id))
  # projectList <- jsonlite::fromJSON(projectUrl)
  # attname = "temp_e.csv"
  # new_att = projectList[["_attachments"]]
  # new_att = new_att[!names(new_att)%in%attname]
  # new_att[[attname]] = list(content_type="application/vnd.ms-excel", data = RCurl::base64Encode(readBin('temp_e.csv', "raw", file.info('temp_e.csv')[1, "size"]), "txt"))
  # projectList[["_attachments"]] = new_att
  #
  # result = RCurl::getURL(projectUrl,customrequest='PUT',httpheader=c('Content-Type'='application/json'),postfields= jsonlite::toJSON(projectList,auto_unbox = T, force = T))

result = list(e=1,p=obj$p,f=obj$f,data_matrix=obj$data_matrix[1:min(nrow(obj$data_matrix),200),1:min(ncol(obj$data_matrix),200)],project_id=project_id)