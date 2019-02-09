
  pacman::p_load(data.table, affy)
  # p = fread("p.csv")
  # f = fread("f.csv")
  # e = fread("e.csv"); e = data.matrix(e)
e = data.matrix(fread(URLencode(paste0("http://metda.fiehnlab.ucdavis.edu/db/project/",project_id,"/temp_e.csv"))))

  normalize.quantile <- get("normalize.quantiles",en=asNamespace("affy"))
  e_quantile_normalization_norm <- normalize.quantile(data.matrix(e))

  data = aggregate_p_f_e(p, f, e_quantile_normalization_norm)

  data_matrix = as.matrix(data)
  report_html = paste0("<h4>quantile normalization is performed.</h4>")

  result = list(
    data_matrix = data_matrix,
    report_html =report_html
  )























