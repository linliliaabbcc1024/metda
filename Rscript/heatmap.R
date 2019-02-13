
  # helper function for creating dendograms
  ggdend <- function(df) {
    ggplot() +
      geom_segment(data = df, aes(x=x, y=y, xend=xend, yend=yend)) +
      labs(x = "", y = "") + theme_minimal() +
      theme(axis.text = element_blank(), axis.ticks = element_blank(),
            panel.grid = element_blank())
  }
  pacman::p_load(data.table, ggdendro, plotly, ggplot2)
  # dataset_input = fread("dataset_input.csv")
  # dataset_input = as.list(dataset_input)
  # p = fread("p.csv")
  # f = fread("f.csv")
  # e = fread("e.csv"); e = data.matrix(e)
e = data.matrix(fread(URLencode(paste0("http://metda.fiehnlab.ucdavis.edu/db/project/",project_id,"/temp_e.csv"))))
  # dataframe[
  #   with(dataframe, order(z, x)),
  #   ]

  # save(e,f,p,file="local.RData")

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
  
  
  
  
  #dendogram data
  if(order_sample == 'dendrogram'){
    hc.col = hclust(dist(t(e_scale)))
    dd.col <- as.dendrogram(hc.col)
    dy <- dendro_data(dd.col)
    py <- ggdend(dy$segments) + coord_flip()
    yy = ggplotly(py)
  }else{
    hc.col = list()
    hc.col$order = 1:nrow(e)
  }

  if(order_compound=='dendrogram'){
    hc.row = hclust(dist(e_scale))
    dd.row <- as.dendrogram(hc.row)
    dx <- dendro_data(dd.row)
    px <- ggdend(dx$segments)
    xx = ggplotly(px)
  }else{
    hc.row = list()
    hc.row$order = 1:ncol(e)
  }


  report_html = paste0("<h4>Heatmap Report</h4>")


  hc.col.order = hc.col$order
  hc.row.order = hc.row$order
  result = list(
    # temp_data = t(e_scale[hc.row.order,hc.col.order]),
    temp_data = t(e_scale),
    report_html =report_html,
    sx = xx$x$data[[1]]$x,
    sy = xx$x$data[[1]]$y,
    cx = yy$x$data[[1]]$x,
    cy = yy$x$data[[1]]$y,
    max = max(e_scale, na.rm = TRUE),
    median = median(e_scale, na.rm = TRUE),
    min = min(e_scale, na.rm = TRUE),
    hc_col_order = hc.col.order-1,
    hc_row_order = hc.row.order-1
  )
























