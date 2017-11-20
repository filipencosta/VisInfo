
file_old = open('ufo.csv', 'r')
file_new = open('ufo02.csv', 'w')

shape_map = { '""':'"unknown"', '"delta"':'"unknown"', '"round"':'"unknown"', '"pyramid"':'"unknown"', '"hexagon"':'"unknown"', '"flare"':'"unknown"', '"crescent"':'"unknown"', '"changed"':'"unknown"' }
#print shape_map
for line in file_old:
    line_split = line.split(",")
    #print line_split[4]
    if line_split[4] in shape_map: #if shape is in shape_map
        #print line_split[4]
        line_split[4]=shape_map[line_split[4]] #change shape name
    
    file_new.write(','.join(map(str, line_split)))

file_old.close()
file_new.close()
