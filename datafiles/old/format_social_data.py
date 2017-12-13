file_new = open('unemployment_formatted.csv', 'w')
file_old = open('unemployment.csv', 'r')
ignore_first_line= file_old.readline()

file_new.write('"year","country","value"\n')

for line in file_old:
    line_split = line.split(",")
    country_code = line_split[1]
    #print country_code
    for i in range(2,60):
        if line_split[i] and line_split[i]!='\n':
            #print "TEM " + line_split[i]
            file_new.write(str(1958+i)+ ',"'+country_code+'",'+line_split[i]+'\n')#comeca em 1960 com i=2
        # else:
            # print "nao tem" + line_split[i]
        
    
    # # print "line: " + line_split[1] + ", country: " + country[:-1]
    # # if line_split[1] == country[:-1]:
        # # print "AAA"
    # if line_split[1] == country[:-1]: #ignore end of line char
        # year=int(line_split[0])#update current year
        # if hasAppeared:
            # previous_year+=1
            # while previous_year < year:
                # file_new.write(str(previous_year) + "," + country[:-1] + ",0\n")
                # previous_year+=1
        # else:
            # hasAppeared=True
            # previous_year=int(line_split[0])
        # file_new.write(','.join(map(str, line_split))) #copy line
        
file_old.close()
            

file_new.close()
