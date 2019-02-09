confirm_and_upload_dataset = function(path,project_id =  "testing_1548956282123",new_node,tree_structure){

  pacman::p_load(data.table,stringr)

  # save(path,project_id,new_node,file="local.RData")
  # return(TRUE)
  # load("local.RData")

  dta = from_path_to_data(path)

  e= dta$e
  p= dta$p
  f= dta$f
  data_matrix= dta$data_matrix

  # obj = upload_dataset(path,project_id=project_id)
  fwrite(data.table(data_matrix),"temp_e.csv",col.names = FALSE)
  # data.matrix(fread("temp_e.csv"))
  #
  #
  projectUrl <- URLencode(paste0("http://slfan:metabolomics@localhost:5985/project/",project_id))
  projectList <- jsonlite::fromJSON(projectUrl,simplifyDataFrame = FALSE)
  attname = new_node$attachment_id
  new_att = projectList[["_attachments"]]
  new_att = new_att[!names(new_att)%in%attname]
  new_att[[attname]] = list(content_type="application/vnd.ms-excel", data = RCurl::base64Encode(readBin('temp_e.csv', "raw", file.info('temp_e.csv')[1, "size"]), "txt"))
  projectList[["_attachments"]] = new_att

  # new_node_df = data.table(id = new_node$id, parent=new_node$parent,text = new_node$text, icon = new_node$icon, parameters = list(a=NA), attachment_id = new_node$attachment_id, efp = new_node$efp, analysis_type = NA)

  projectList$tree_structure = tree_structure

  result = RCurl::getURL(projectUrl,customrequest='PUT',httpheader=c('Content-Type'='application/json'),postfields= jsonlite::toJSON(projectList,auto_unbox = T, force = T))

  return(TRUE)
  # return(list(e=1,p=obj$p,f=obj$f,data_matrix=obj$data_matrix[1:min(nrow(obj$data_matrix),200),1:min(ncol(obj$data_matrix),200)],project_id=project_id))
}
