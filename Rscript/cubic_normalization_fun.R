
  pacman::p_load(data.table,affy)
  # p = fread("p.csv")
  # f = fread("f.csv")
  # e = fread("e.csv"); e = data.matrix(e)

e = data.matrix(fread(URLencode(paste0("http://metda.fiehnlab.ucdavis.edu/db/project/",project_id,"/temp_e.csv"))))
  spline.data <- normalize.qspline(e,samples=0.02,target=apply(e,1,mean),verbose = FALSE)
  e_cubic_normalization_norm <- t(t(e)/quotient.median)

  data = aggregate_p_f_e(p, f, e_cubic_normalization_norm)

  data_matrix = as.matrix(data)
  report_html = paste0("<h4>Cubic normalization is performed.</h4>")

 result = list(
    data_matrix = data_matrix,
    report_html =report_html
  )


















