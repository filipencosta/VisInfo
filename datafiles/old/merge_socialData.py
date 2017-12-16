file_new = open('allInfo_byYear.csv', 'w')
file_new.write('"year","country","sightings","gdp","unemployment", "internet","scifi"\n')


file_sightings = open('groupbyCountryYear_addedZeros.csv', 'r')
file_gdp = open('gdp_formatted_addedZeros.csv', 'r')
file_unemploy = open('unemployment_formatted_addedZeros.csv', 'r')
file_internet = open('internet_formatted_addedZeros.csv', 'r')
file_movies = open('MoviesGroupByYear_addedZeros.csv', 'r')

file_countryList = open('countrySort.csv', 'r')

ignore_first_line= file_sightings.readline()
ignore_first_line= file_gdp.readline()
ignore_first_line= file_unemploy.readline()
ignore_first_line= file_internet.readline()
ignore_first_line= file_movies.readline()

ignore_first_line= file_countryList.readline()

mydict={}

for country in file_countryList:
    country=country[:-1]
    # print country[:-1]
    for year in range(1960,2015): #up to 2014
        mydict[(country,year)]=[0,0,0,0,0]

#add "world", used in scifi_movies
for year in range(1960,2015): #up to 2014
        mydict[('"world"',year)]=[0,0,0,0,0]

        
# print mydict
# for key in sorted(mydict.iterkeys()):
    # print "%s: %s" % (key, mydict[key])

#fill in dictionary...
for line in file_sightings:
    line_split = line.split(",")
    year=int(line_split[0])
    country=line_split[1]
    sightings=int(line_split[2][:-1])
    # #DEBUG
    # print "country: " + country + ", year: " + str(year)
    # for key in sorted(mydict.iterkeys()):
        # print "%s: %s" % (key, mydict[key])
    # #/DEBUG
    # if ( (country,year) in mydict ):
        # 
    if ( (country,year) in mydict ):
        mydict[(country,year)][0]=sightings
        
for line in file_gdp:
    line_split = line.split(",")
    year=int(line_split[0])
    country=line_split[1]
    gdp=float(line_split[2][:-1])
    
    if ( (country,year) in mydict ):
        mydict[(country,year)][1]=gdp
        
for line in file_unemploy:
    line_split = line.split(",")
    year=int(line_split[0])
    country=line_split[1]
    unemployment=float(line_split[2][:-1])
    
    if ( (country,year) in mydict ):
        mydict[(country,year)][2]=unemployment
        
for line in file_internet:
    line_split = line.split(",")
    year=int(line_split[0])
    country=line_split[1]
    internet=float(line_split[2][:-1])
    
    if ( (country,year) in mydict ):
        mydict[(country,year)][3]=internet
        
for line in file_movies:
    line_split = line.split(",")
    year=int(line_split[0])
    country=line_split[1]
    movies=int(line_split[2][:-1])
    
    if ( (country,year) in mydict ):
        mydict[(country,year)][4]=movies
        
        

#print to new file
for key in sorted(mydict.iterkeys()):
    #"year","country","sightings","gdp","unemployment", "internet","scifi"
    file_new.write(str(key[1])+","+key[0]+","+str(mydict[key][0])+","+str(mydict[key][1])+","+str(mydict[key][2])+","+str(mydict[key][3])+","+str(mydict[key][4])+'\n')


file_sightings.close()
file_gdp.close()
file_internet.close()
file_movies.close()
file_unemploy.close()
file_new.close()
file_countryList.close()