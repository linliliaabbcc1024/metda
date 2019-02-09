

  downloadFileName = paste0(path[1],".zip")

  project = jsonlite::fromJSON(URLencode(paste0("http://metda.fiehnlab.ucdavis.edu/db/project/",project_id)), simplifyVector = F)
  project_att = project[['_attachments']]
  project_att_name = names(project_att)
  project_tree_structure_id = sapply(project$tree_structure, function(x) x$id)
  project_tree_structure_attname = sapply(project$tree_structure, function(x) x$attachment_id, simplify = F)
  names(project_tree_structure_attname) = project_tree_structure_id
  names(path) = id


  attname = project_tree_structure_attname[project_tree_structure_id%in%id]


  for(i in 1:length(id)){
    if(is.null(attname[[i]])){ # this means that the ith element is a folder.
      dir.create(path[names(attname)[i]],recursive = T, showWarnings  = F)
    }else{ # this means that the ith element is a file.
      download.file(URLencode(paste0("http://metda.fiehnlab.ucdavis.edu/db/project/",project_id,"/",gsub("\\+","%2B",attname[i]))),path[names(attname)[i]],mode = 'wb')
    }
  }

  zip(zipfile = downloadFileName, files = path[1])


result = downloadFileName
  #return(downloadFileName)
