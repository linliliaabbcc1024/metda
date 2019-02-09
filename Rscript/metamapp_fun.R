

  pacman::p_load(data.table)

  # fwrite(data.table(p),"p.csv")
  # fwrite(data.table(f),"f.csv")
  # fwrite(data.table(e),"e.csv")
  #
  # return(list(p,f,e))
e = data.matrix(fread(URLencode(paste0("http://metda.fiehnlab.ucdavis.edu/db/project/",project_id,"/temp_e.csv"))))
  # e = fread("e.csv")
  # f = fread("f.csv")
  # p = fread("p.csv")
  #
  # fwrite(data.table(e),"e.csv")
  # fwrite(f,"f.csv")
  # fwrite(p,"p.csv")

  if(!fold_change_critical==1){
    f[[foldchange]] = ifelse(as.numeric(f[[foldchange]])>fold_change_critical, 1.1, 0.9)
  }





  result = data.table(f[[pubchemid]],f[[kegg]],f[[smiles]],f[[compound_label]],f[[pvalue]],f[[foldchange]])
  colnames(result) = c("PubChem_ID","KEGG_ID","SMILES","Compound_Name","Condition_A_pvalue","Condition_A_foldchange")

  # result$PubChem_ID = as.numeric(result$PubChem_ID) # does not have to be numbers

  result[result==""] = NA

  # NA is not allowed in pubchem_ID
  result = result[(!is.na(result$PubChem_ID)) & (!is.na(result$KEGG_ID)) & (!is.na(result$SMILES)) & (!is.na(result$Compound_Name)) & (!is.na(result$Condition_A_pvalue)) & (!is.na(result$Condition_A_foldchange)),]

  # make compound name unique
  result$Compound_Name = make.unique(result$Compound_Name)

  # make the pubchemID unique
  result = result[!duplicated(result$PubChem_ID),]

  fwrite(result,'result.csv')


  if(!do_not_do){
    txtinput = paste0(apply(rbind(matrix(colnames(result),nrow = 1),data.matrix(sapply(result,as.character))),1,function(x){
      paste0(x,collapse = "\t")
    }),collapse = "\n")

    metamapp_result = RCurl::getURL(URLencode("http://metamapp.fiehnlab.ucdavis.edu/ocpu/library/MetaMapp2017/R/runMetaMapp"),
                                    customrequest = "POST", httpheader = c(`Content-Type` = "application/json"),
                                    postfields = jsonlite::toJSON(list(stat_file = txtinput),force = T, auto_unbox = TRUE))

    if(substr(metamapp_result, 1, 9) == "/ocpu/tmp"){# this means there is no error for the computation.
      session_id = paste0(strsplit(strsplit(metamapp_result,"\n")[[1]][1],"/")[[1]][1:4],collapse = "/")
    }else{
      session_id = metamapp_result
    }
    report_html = paste0("<h4>The metamapp input generated.</h4>")
  }else{
    session_id = 'nope'
    report_html = paste0("<b>The metamapp input is generated. Now you may use the input file to go to http://metamapp.fiehnlab.ucdavis.edu to perform MetaMapp Network Visualization.</b>")
  }










result = list(
    result = result,
    report_html =report_html,
    session_id = session_id
  )




















