import csv
from datetime import datetime
import re
import ast
import json
#import pandas as pd

ufoCSV = "/Users/lads/Google Drive/IST/Masters/Year 2/1rst Semester/VisInfo/Project/datafiles/ufo.csv"
outputCSV = "/Users/lads/Google Drive/IST/Masters/Year 2/1rst Semester/VisInfo/Project/datafiles/ufo_v2.csv"

try:
	#Open Main Dataset
	ufo = csv.reader(open(ufoCSV, "r"), delimiter=',', dialect='excel')

	#File to write to
	output = csv.writer(open(outputCSV, "w"), delimiter=',', quotechar='"', quoting=csv.QUOTE_ALL)

	#Append to Header row some extra measures
	# row0 = next(output)
	# row0.append("Country")
	# output.writerow(row0)

	#Map of YEAR - Number of Sightings for Country
	row0 = next(ufo)
	mapa = {}
	maxa=0
	mina=3000
	for row in ufo:
		country = row[3]
		year = ast.literal_eval(row[15])
		if (mina > year):
			#print("Mina: " + str(mina) + " Year: " + str(ast.literal_eval(year)))
			mina = year

		if (maxa < year):
			maxa = year

		if mapa.has_key(country):
			if mapa[country].has_key(year):
				mapa[country][year] += 1
			else:
				mapa[country][year] = 1
		else:
			mapa[country] = {}

	for key in mapa.keys():
		for i in range(1964, 2014):
			if (not mapa[key].has_key(i)):
				mapa[key][i] = 0
			
	final = []
	for key in mapa.keys():
		dict_ = mapa[key]
		dict_["country"] = key
		final.append(dict_)
		print(dict_)
		


	with open('number_sightings.json', 'w') as outfile:
		json.dump(final, outfile)
	# #Add measures ro each row
	# for row in ufo:
	# 	time = None
	# 	try:
	# 		time = datetime.strptime(row[0], '%m/%d/%Y %H:%M')
	# 	except ValueError:
	# 		row[0] = row[0].replace(' 24:', ' 00:')
	# 		time = datetime.strptime(row[0], '%m/%d/%Y %H:%M')
	# 	row[0] = time
	# 	country = row[3]
	# 	if time != None and country != None:
	# 		year = time.year
	# 		try:
	# 			row.append(float(gdp2.loc[country,str(year)]))
	# 			row.append(float(internet2.loc[country,str(year)]))
	# 			row.append(float(unemployment2.loc[country,str(year)]))
	# 			row.append(int(films2.loc[year, "Count"]))
	# 			row.append(year)
	# 			output.writerow(row)
	# 		except KeyError as e:
	# 			print(e)
			
except Exception as e:
	raise e