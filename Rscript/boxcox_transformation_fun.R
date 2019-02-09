
  pacman::p_load(data.table, MASS)


  # fwrite(data.table(p), "p.csv")
  # fwrite(data.table(f), "f.csv")
  # fwrite(data.table(e), "e.csv")
  # return(T)
  # p = fread("p.csv")
  # f = fread("f.csv")
  # e = fread("e.csv"); e = data.matrix(e)

e = data.matrix(fread(URLencode(paste0("http://metda.fiehnlab.ucdavis.edu/db/project/",project_id,"/temp_e.csv"))))

  mins = apply(e,1,min,na.rm = TRUE)
  e = e-(mins-1)



  lambdas = apply(e,1,function(x){

    # for(i in 1:nrow(e)){
      # x = e[i,]
      dta = data.table(x,p[,columns])
      bc = tryCatch({boxcox(x ~ ., data = dta, plotit = FALSE)}, error = function(error){
        return(list(y =1,x = 1))
      })
      lambda = bc$x[which.max(bc$y)]
    # }

    return(lambda)
  })

  for(i in 1:nrow(e)){
    if(lambdas[i] == 0){
      e[i,] = log(e[i,] + 0)
    }else{
      e[i,] = (((e[i,] + 0)^lambdas[i] ) - 1) / lambdas[i]
    }
  }
  e = e+(mins-1)

  data = aggregate_p_f_e(p, f, e)

  data_matrix = as.matrix(data)
  report_html = paste0("<h4>Box-Cox Transformation is performed.</h4>")

  result = list(
    data_matrix = data_matrix,
    report_html =report_html
  )



















