
  pacman::p_load(base64enc,rsvg)


  for(i in 1:length(base64s)){
    conn <- file("w.bin","wb")
    writeBin(base64s[i], conn)
    close(conn)
    inconn <- file("w.bin","rb")
    outconn <- file("temp.svg","wb")
    base64decode(what=inconn, output=outconn)
    close(inconn)
    close(outconn)
    rsvg_png("temp.svg", filenames[i], width = width, height = height)
  }

  zip(zipfile = zip_filename, files = filenames)
result = TRUE



# o  = readtext("test.rtf")
# oo  = strsplit(o$text,"kerning0\n")[[1]][2]
# oo= substr(oo,1,nchar(oo)-1)
#
#
# conn <- file("w.bin","wb")
# writeBin(oo, conn)
# close(conn)
# inconn <- file("w.bin","rb")
# outconn <- file("temp.svg","wb")
# base64decode(what=inconn, output=outconn)
# close(inconn)
#
# close(outconn)
