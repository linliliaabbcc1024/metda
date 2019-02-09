# put the rscript to the project.

all_r_files = list.files('rscript')



# projectUrl = URLencode(paste0("https://localhost:5985/rscript/","rscript"))
projectUrl = URLencode(paste0("https://metda.fiehnlab.ucdavis.edu/db/rscript/","rscript"))
projectList <- jsonlite::fromJSON(projectUrl)


for(i in 1:length(all_r_files)){
  attname = all_r_files[i]
  new_att = projectList[["_attachments"]]
  new_att = new_att[!names(new_att)%in%attname]
  new_att[[attname]] = list(content_type="application/octet-stream",data=RCurl::base64Encode(readBin(paste0("rscript/",attname),"raw",file.info(paste0("rscript/",attname))[1,"size"]),"txt"))
  projectList[['_attachments']] = new_att
}
result= RCurl::getURL(projectUrl, customrequest='PUT',httpheader=c('Content-Type'='application/json'),postfields=jsonlite::toJSON(projectList,auto_unbox=T,force=T))


