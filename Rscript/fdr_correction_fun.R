



  pacman::p_load(data.table)

  # fwrite(data.table(p),"p.csv")
  # fwrite(data.table(f),"f.csv")
  # fwrite(data.table(e),"e.csv")
  # return(p)

#   p = fread("p (1).csv")
#   f = fread("f (1).csv")
#   e = fread("e (1).csv"); e = data.matrix(e)
e = data.matrix(fread(URLencode(paste0("http://metda.fiehnlab.ucdavis.edu/db/project/",project_id,"/temp_e.csv"))))
  p_values = e[,which(p$label == column)]

  result = data.table(index = 1:nrow(f), label = f$label, p_values = p_values, p_values_adjusted = p.adjust(p_values, method = FDR))


  report_html = paste0("<b>FDR Correction <code>(",column,")</code> was performed on the raw p values. There are ",sum(p_values<0.05,na.rm = TRUE)," p value < 0.05. After FDR correction, there are ",sum(result$p_values_adjusted<0.05,na.rm = TRUE)," adjusted p value < 0.05.</b>")



result = list(
    result = result,
    report_html =report_html
  )


















