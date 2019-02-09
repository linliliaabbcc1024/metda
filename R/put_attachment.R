put_attachment = function(project_ID="MX 399479 GCTOF Data - Rat esophagus data_1546278737869",to_be_saved){

  #write.csv(to_be_saved,"test.csv")

  # to_be_saved = fread("http://localhost:5656/ocpu/tmp/x0506f41aaff54a/files/test.csv")

  projectUrl = URLencode(paste0("http://slfan:metabolomics@localhost:5985/project/",project_ID))
  projectList <- jsonlite::fromJSON(projectUrl)

  for(i in 1:nrow(to_be_saved)){
    if(!is.na(to_be_saved[i,]$content_type)){
      projectList[['_attachments']][[to_be_saved[i,]$attachment_id]] = list(
        content_type=to_be_saved[i,]$content_type,
        data= to_be_saved[i,]$saving_content
      )
    }
  }

  result = RCurl::getURL(projectUrl, customrequest='PUT', httpheader=c('Content-Type'='application/json'),postfields=jsonlite::toJSON(projectList,auto_unbox = TRUE,force = TRUE))
  return(result)
  # return(TRUE)
}
