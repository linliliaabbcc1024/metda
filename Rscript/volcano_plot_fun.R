

  pacman::p_load(data.table)
  # p = fwrite(data.table(p), "p.csv")
  # f = fwrite(data.table(f), "f.csv")
  # e = fwrite(data.table(e), "e.csv");
  #
  # return(TRUE)


  # p = fread("p.csv")
  # f = fread("f.csv")
  # e = fread("e.csv"); e = data.matrix(e)
  e = data.matrix(fread(URLencode(paste0("http://metda.fiehnlab.ucdavis.edu/db/project/",project_id,"/temp_e.csv"))))
  data_matrix = as.matrix(data)
  report_html = paste0("<h4>log transformation is performed.</h4>")

  result =list(
    data_matrix = data_matrix,
    report_html =report_html
  )























