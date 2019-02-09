


  pacman::p_load(data.table, ez)

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


  p_values = apply(e,1,function(x){
    dta = data.table(value = x, group = groups, id = ids)
    tryCatch(ezANOVA(data = dta, dv = value, wid = id, within =  .(group))$`Sphericity Corrections`$`p[GG]`,error = function(e){return(1)})
  })


  result = data.table(index = 1:nrow(f), label = f$label, p_values = p_values, p_values_adjusted = p.adjust(p_values, method = FDR))


  report_html = paste0("<b>One-way Repeated ANOVA was performed on each compound to test if at least one level of <code>",groups_dep,"</code> has a mean average significantly different form the rest. Greenhouse-Geisser correction was applied to accommodate the sphericity assumption. The samples were matched with <code>",id,"</code>. As a result, there are ",sum(p_values<0.05,na.rm = TRUE)," compounds significant with p-value less than 0.05. To controll the False Discovery Rate (FDR), ",FDR," was applied on the raw p-values. <code>",sum(p.adjust(p_values, method = FDR)<0.05,na.rm = TRUE),"</code> compounds are still significant after the FDR correction.</b>")




  result = list(
    result = result,
    report_html =report_html
  )












