#!bin/bash

cat heatmapfinalv2.csv | awk 'BEGIN{FS=","; OFS=","}{print $2,$3,$5}'| tail -n+2| awk -F, 'BEGIN{OFS=","}{a[$1","$2]+=$3}END{for (i in a) print i,a[i]}'|sort > groupbyCountryYear.csv