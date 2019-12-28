#!/bin/bash

FN=documentation/timesheet.md

if [ ! -f ${FN} ]; then
    echo "${0}: File '${FN}' not found error!"
    exit 1
fi

MATH=$(for i in $(grep -E '^  <tr><td>' ${FN} | cut --characters=26-31)
       do
           echo -n "${i}+"
       done
       echo "0"
    )
echo ${MATH}
echo -n "Total="
echo ${MATH} | bc -l
