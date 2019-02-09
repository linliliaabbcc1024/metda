
  pacman::p_load(data.table)
  # p = fread("p.csv")
  # f = fread("f.csv")
  # e = fread("e.csv"); e = data.matrix(e)

e = data.matrix(fread(URLencode(paste0("http://metda.fiehnlab.ucdavis.edu/db/project/",project_id,"/temp_e.csv"))))
  reference <- apply(e, 1, median, na.rm = TRUE)
  reference[reference==0] = 1
  quotient <- e/reference
  quotient.median <- apply(quotient, 2, median, na.rm=TRUE)
  e_PQN_normalization_norm <- t(t(e)/quotient.median)

  data = aggregate_p_f_e(p, f, e_PQN_normalization_norm)

  data_matrix = as.matrix(data)
  report_html = paste0("<b>Probabilistic quotient normalization (PQN) is performed.</b>")

  result = list(
    data_matrix = data_matrix,
    report_html =report_html
  )


























