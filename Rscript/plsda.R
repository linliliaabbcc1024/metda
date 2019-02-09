


  pacman::p_load(data.table, ropls)
  # dataset_input = fread("dataset_input.csv")
  # dataset_input = as.list(dataset_input)
  # p = fread("p.csv")
  # f = fread("f.csv")
  # e = do.call("cbind",dataset_input[c(-1, -length(dataset_input))])
  # e = t(apply(e,1,as.numeric))

  # save(e,f,p,file="local.RData")
  # load('local.RData')
  # return(TRUE)

  e = data.matrix(fread(URLencode(paste0("http://metda.fiehnlab.ucdavis.edu/db/project/",project_id,"/temp_e.csv"))))

  e = t(apply(e,1,function(x){
    x[is.na(x)] = 0.5 * mean(x[!is.na(x)])
    return(x)
  }))

  if(scale=='none'){
    sds = rep(1,nrow(f))
  }else if(scale=="standard"){
    sds = apply(e,1,sd,na.rm = TRUE)
  }else if(scale=='pareto'){
    sds = sqrt(apply(e,1,sd,na.rm = TRUE))
  }else if(scale == "center"){
    sds = rep(1,nrow(f))
  }

  e_t = t(e)
  e_scale = scale(e_t, center = !scale=='none', scale = sds)

  y = factor(p[[column]])

  plsda = ropls::opls(x = e_scale, y = y, predI = min(10,ncol(e_scale)), perm = 0, scaleC ="none", printL = FALSE, plotL = FALSE)

  variance = plsda@modelDF$R2X
  R2 = plsda@modelDF$`R2Y(cum)`
  Q2 = plsda@modelDF$`Q2(cum)`


  scores = plsda@scoreMN
  loadings = plsda@loadingMN


  plsda_best = ropls::opls(x = e_scale, y = y, predI = which.max(Q2), perm = 0, scaleC ="none", printL = FALSE, plotL = FALSE)
  vips = plsda_best@vipVn
  vip_table = data.table(index = 1:nrow(f), label = f$label, vip = vips)
  vip_table = vip_table[order(vips, decreasing = TRUE),]

  vip_heatmap = t(apply(e,1,function(x){
    order(by(x,y,mean))
  }))
  vip_heatmap = vip_heatmap[order(vips, decreasing = TRUE),]


  report_html = paste0("<h4>PLS-DA repoert.</h4>")



  result = list(
    scores = scores,
    loadings = loadings,
    R2 = R2,
    Q2 = Q2,
    variance = variance,
    vip_table = vip_table,
    vip_heatmap=vip_heatmap,
    vip_heatmap_text = levels(y),
    report_html =report_html
  )






















