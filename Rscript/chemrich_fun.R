


  pacman::p_load(data.table)
  # e = fread("e.csv")
  # f = fread("f.csv")
  # p = fread("p.csv")
  #
  # fwrite(data.table(e),"e.csv")
  # fwrite(f,"f.csv")
  # fwrite(p,"p.csv")

  # save(e,f,p,file="local.RData")
  # load("local.RData")
e = data.matrix(fread(URLencode(paste0("http://metda.fiehnlab.ucdavis.edu/db/project/",project_id,"/temp_e.csv"))))
  f[[foldchange]] = ifelse(as.numeric(f[[foldchange]])>fold_change_critical, 1.1, 0.9)

  result = data.table(f[[compound_label]],f[[inchikey]],f[[pubchemid]],f[[smiles]],f[[pvalue]],f[[foldchange]])
  colnames(result) = c("Compound Name","InChiKeys","Pubchem ID","SMILES","pvalue","foldchange")

  # result$`Pubchem ID` = as.numeric(result$`Pubchem ID`)



  # NA is not allowed in pubchem_ID
  result = result[(!is.na(result[["Compound Name"]])) & (!is.na(result[["InChiKeys"]])) & (!is.na(result$SMILES)) & (!is.na(result[["Pubchem ID"]])) & (!is.na(result$pvalue)) & (!is.na(result$foldchange)) & (!result$SMILES == ""),]

  # make compound name unique
  result$`Compound Name` = make.unique(result$`Compound Name`)

  # make the pubchemID unique
  result = result[!duplicated(result$`Pubchem ID`),]

  fwrite(result,"result.csv")

  if(!do_not_do){
    txtinput = paste0(apply(rbind(matrix(colnames(result),nrow = 1),data.matrix(sapply(result,as.character))),1,function(x){
      paste0(x,collapse = "\t")
    }),collapse = "\n")

    chemrich_result = RCurl::getURL(URLencode("http://chemrich.fiehnlab.ucdavis.edu/ocpu/library/ChemRICHTest3/R/getChemRich_windows/"),customrequest = "POST", httpheader = c(`Content-Type` = "application/json"),postfields = jsonlite::toJSON(list(stat_file = txtinput),force = T, auto_unbox = TRUE))

    if(substr(chemrich_result, 1, 9) == "/ocpu/tmp"){# this means there is no error for the computation.
      session_id = paste0(strsplit(strsplit(chemrich_result,"\n")[[1]][1],"/")[[1]][1:4],collapse = "/")
    }else{
      session_id = chemrich_result
    }
    report_html = paste0("<h4>The chemrich input generated.</h4>")
  }else{
    session_id = 'nope'
    report_html = paste0("<b>The ChemRICH input is generated. Now you may use the input file to go to http://chemrich.fiehnlab.ucdavis.edu/ to perform ChemRICH analysis.</b>")
  }











  result = list(
    result = result,
    report_html =report_html,
    session_id = session_id
  )


















