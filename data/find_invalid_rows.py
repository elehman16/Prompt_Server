# -*- coding: utf-8 -*-
"""
Created on Tue Mar 20 23:11:03 2018

@author: Eric
"""
import pandas as pd
import numpy as np
from functools import reduce

csv_file_loc = 'for-full-text-annotation-207-unique-redux.csv'
all_rows = pd.read_csv(csv_file_loc)
all_rows = np.asarray(all_rows)


# determines if a word is ascii.
def is_ascii(s):
    return all(ord(c) < 128 for c in s)
    
# Determines if all words are ascii in the sentence.
def is_all_ascii(sentence):
    return reduce((lambda x, y: is_ascii(y) and x), sentence.split(" "), True)
    
i = 2 # 1 index
bad_rows = []
for row in all_rows:
    j = 1
    for sub_row in row:
        if not(is_all_ascii(str(sub_row))):
            # sub_row.split(" ")[2].encode('latin1').decode('utf-8')
            bad_rows.append([i, j])
        
        j += 1
    
    i += 1
    