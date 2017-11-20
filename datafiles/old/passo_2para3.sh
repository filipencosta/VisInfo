#!/bin/bash
cat ufo02.csv | awk 'BEGIN{FS=",";OFS=","; cont=0}{print(cont,$1,$4,$5,$6,$10,$11,$12,$13,$14,$15,$16);cont++}' > ufo03.csv
