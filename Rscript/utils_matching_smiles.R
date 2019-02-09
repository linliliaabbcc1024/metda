utils_matching_smiles = function(data1 = "/Users/silifan/Documents/GitHub/mx\ 399479\ Louise\ Fong/smiles.txt", data2 = "/Users/silifan/Documents/GitHub/mx\ 399479\ Louise\ Fong/mx\ 399479\ Louise\ Fong_rat_esophagus_08-2018\ submit.xlsx"){
  pacman::p_load(data.table)
  dta1 = fread(data1, header = F)

  dta2 = wcmc::read_data(data2)$f

  dta1 = dta1[!duplicated(dta1$V1),]


  result_smiles = merge(dta2, dta1, by.x = "InChI Key", by.y = "V1", sort = FALSE, all.x = TRUE, all.y = FALSE)$V2


  dta2$smiles = result_smiles


  write.csv(dta2,"smiles.csv")
}
