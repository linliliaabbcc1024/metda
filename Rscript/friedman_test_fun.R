
  pacman::p_load(data.table)

  # fwrite(data.table(p),"p.csv")
  # fwrite(data.table(f),"f.csv")
  # fwrite(data.table(e),"e.csv")
  # return(p)


  # p = fread("p.csv")
  # f = fread("f.csv")
  # e = fread("e.csv"); e = data.matrix(e)


e = data.matrix(fread(URLencode(paste0("http://metda.fiehnlab.ucdavis.edu/db/project/",project_id,"/temp_e.csv"))))
  e = t(apply(e,1,function(x){
    x[is.na(x)] = 0.5 * mean(x[!is.na(x)])
    return(x)
  }))

  groups = factor(p[[groups_dep]])

  levels = levels(groups)

  ids = factor(p[[id]])

  group_indexes = sapply(levels(groups), function(x) groups%in%x, simplify = F)

  k = length(group_indexes)
  n = length(levels(ids))
  e_list_by_id = sapply(levels(ids), function(x) e[,ids%in%x], simplify = F)
  r_list = sapply(e_list_by_id, function(x){
    t(apply(x, 1, function(x) rank(x, na.last = "keep")))
  }, simplify = FALSE)
  r_list_array = array(unlist(r_list), dim = c(nrow(r_list[[1]]),ncol(r_list[[1]]),length(r_list)))

  TIES = apply(r_list_array, 1, function(x){
    apply(x,2,table)
  })
  no_TIES_index = sapply(TIES, class) == "matrix"

  STATISTIC  = rep(NA, nrow(e))
  STATISTIC = rowSums((t(apply(r_list_array, 1, function(x){
    rowSums(x)
  })) - n * (k+1)/2)^2)*12/(n * k * (k + 1))
  if(sum(no_TIES_index)>0){
    STATISTIC[!no_TIES_index] = rowSums((t(apply(r_list_array[!no_TIES_index,,], 1, function(x){
      rowSums(x)
    })) - n * (k+1)/2)^2)*12/(n * k * (k + 1)
                              - (sapply(TIES[!no_TIES_index], function(x) sum(unlist(lapply(x, function (u) {u^3 - u})))) /
                                   (k - 1)))

  }
  PARAMETER <- k - 1
  p_values <- pchisq(STATISTIC, PARAMETER, lower.tail = FALSE)
  adjusted_p = p.adjust(p_values,FDR)



  result = data.table(index = 1:nrow(f), label = f$label, p_values = p_values, p_values_adjusted = adjusted_p)


  report_html = paste0("<b>One-way Friedman test was performed on each compound to test if at least one level of <code>",groups_dep,"</code> has a mean average significantly different form the rest. The samples were matched with <code>",id,"</code>. As a result, there are ",sum(p_values<0.05,na.rm = TRUE)," compounds significant with p-value less than 0.05. To controll the False Discovery Rate (FDR), ",FDR," was applied on the raw p-values. <code>",sum(p.adjust(p_values method = FDR)<0.05,na.rm = TRUE),"</code> compounds are still significant after the FDR correction.</b>")




result= list(
    result = result,
    report_html =report_html
  )














