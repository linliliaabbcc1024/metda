

  pacman::p_load(data.table, imputeLCMD,  magrittr, imputeLCMD)
  # p = fread("p.csv")
  # f = fread("f.csv")
  # e = fread("e.csv"); e = data.matrix(e)
  # e = t(apply(e,1,as.numeric))
e = data.matrix(fread(URLencode(paste0("http://metda.fiehnlab.ucdavis.edu/db/project/",project_id,"/temp_e.csv"))))
  if(by_group){
    group = factor(p[[column]])
  }else{
    group = factor(rep("A", nrow(p)))
  }


  # write.csv(e,'e.csv')
  # Scale and recover -------------------------------------------------------
  scale_recover <- function(data, method = 'scale', param_df = NULL) {
    results <- list()
    data_res <- data
    if (!is.null(param_df)) {
      if (method=='scale') {
        data_res[] <- scale(data, center=param_df$mean, scale=param_df$std)
      } else if (method=='recover') {
        data_res[] <- t(t(data)*param_df$std+param_df$mean)
      }
    } else {
      if (method=='scale') {
        param_df <- data.frame(mean=sapply(data, function(x) mean(x, na.rm=T)),
                               std=sapply(data, function(x) sd(x, na.rm=T)))
        data_res[] <- scale(data, center=param_df$mean, scale=param_df$std)
      } else {stop('no param_df found for recover...')}
    }
    results[[1]] <- data_res
    results[[2]] <- param_df
    return(results)
  }


  imputeds = sapply(levels(group), function(g){
    sub_e = e[,group %in% g]
    data = data.table(t(sub_e))
    data_sc_res <- scale_recover(data, method = 'scale')
    data_sc <- data_sc_res[[1]]
    data_sc_param <- data_sc_res[[2]]
    result <- data.matrix(data_sc) %>% impute.wrapper.SVD(., K = 5) %>%
      scale_recover(., method = 'recover', param_df = data_sc_param) %>% extract2(1)

    sub_e <- t(result)
    return(sub_e)
  }, simplify = FALSE)

  imputed = e
  names(imputeds) = levels(group)
  for(g in levels(group)){
    imputed[,group %in% g] = imputeds[[which(levels(group)%in%g)]]
  }

  data = aggregate_p_f_e(p, f, imputed)

  data_matrix = as.matrix(data)
  report_html = paste0("<h4>SVDmiss is performed.</h4>")

  result = list(
    data_matrix = data_matrix,
    report_html =report_html,
    group = imputeds
  )























