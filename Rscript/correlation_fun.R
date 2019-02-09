

  pacman::p_load(data.table, Hmisc)

  # write.csv(e,"e.csv",row.names = FALSE)
  # write.csv(f,"f.csv",row.names = FALSE)
  # write.csv(p,"p.csv",row.names = FALSE)
  #
  # write.csv(e2,"e2.csv",row.names = FALSE)
  # write.csv(f2,"f2.csv",row.names = FALSE)
  # write.csv(p2,"p2.csv",row.names = FALSE)
  #
  # return(TRUE)

  # e = fread("e.csv")
  # f = fread("f.csv")
  # p = fread("p.csv")
  # e2 = fread("e.csv")
  # f2 = fread("f.csv")
  # p2 = fread("p.csv")
  #
  # e = data.matrix(e)
  # e2 = data.matrix(e2)


  #p$label = substr(p$label,1,nchar(p$label)-4)

  if(is.null(dim(e))){# this means that the data has only one variable
    e = t(e)
  }
  if(is.null(dim(e2))){# this means that the data has only one variable
    e2 = t(e2)
  }
  colnames(e) = p$label
  colnames(e2) = p2$label



  # make sure sample to match the first dataset.
  p_all = merge(p, p2, by = "label", all.x = F, all.y = F, sort = FALSE)


  e = e[,p_all$label]
  e2 = e2[,p_all$label]





  r = cor(t(e), t(e2), method = method, use = "pairwise.complete.obs")
  correlation = data.table(index = 1:nrow(f), label = f$label, r)
  colnames(correlation) = c("index","label",f2$label)

  n <- (ncol(e) + ncol(e2))/2 # sample size
  z <- sqrt((n-3)/1.06)*atanh(r) # z-value, see [1] below
  pval <- 2*pnorm(-abs(z)) # 2-sided p-value
  correlation_sig = data.table(index = 1:nrow(f), label = f$label, pval)
  colnames(correlation_sig) = c("index","label",f2$label)





  #data_matrix = as.matrix(averages)
  report_html = paste0("<h4><code>",method,"</code> correlation was calculated. The correlation coefficient and corresponding p-values are provided.</h4>")

  result = list(
    data_matrix = correlation,
    data_matrix2 = correlation_sig,
    report_html =report_html
  )




















