

file_new = open('MoviesGroupByYear_addedZeros.csv', 'w')

countries_list = open('countrySort_temp.csv','r')
ignore_first_line= countries_list.readline()
file_new.write('"year","country","value"\n')
for country in countries_list:
    file_old = open('MoviesGroupByYear.csv', 'r')
    ignore_first_line= file_old.readline()
    hasAppeared = False    
    previous_year = 1900
    year = 1901
    for line in file_old:
        line_split = line.split(",")
        # print "line: " + line_split[1] + ", country: " + country[:-1]
        # if line_split[1] == country[:-1]:
            # print "AAA"
        if line_split[1] == country[:-1]: #ignore end of line char
            year=int(line_split[0])#update current year
            if hasAppeared:
                previous_year+=1
                while previous_year < year:
                    file_new.write(str(previous_year) + "," + country[:-1] + ",0\n")
                    previous_year+=1
            else:
                hasAppeared=True
                previous_year=int(line_split[0])
            file_new.write(','.join(map(str, line_split))) #copy line
            
    file_old.close()
            

# for line in file_old:
    # line_split = line.split(",")
    # #print line_split[1] #city
    # #line_split[1]=line_split[1]+'AAA'
    # if line_split[3]: #if 'country' is not empty
        # line_split[3]=iso3[line_split[3]] #iso2 to iso3
    # file_new.write(','.join(map(str, line_split)))

file_new.close()
countries_list.close()