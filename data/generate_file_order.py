# -*- coding: utf-8 -*-
"""
Created on Thu Mar 15 14:00:36 2018

@author: Eric
"""

import glob
import random
import pandas as pd
import numpy as np

n = 10

all_txt = glob.glob("*.txt")
all_pmc_files = set()
# Gets all of the files that we have done into a set
for txt in all_txt:
    file_data = np.genfromtxt(txt, dtype = int)
    for pmc_file in file_data:
        all_pmc_files.add(pmc_file)
        
# Gets all of the PMC files
pmcs = glob.glob("..\\path_my_xml_files\\*.nxml")       
# Determines which PMC files we haven't done, and creates a list of N of them
to_do = []
for file in pmcs:
    loc = '..\\path_my_xml_files\\PMC'
    file_num = int(file.replace(loc, "").replace(".nxml", "")) # trim the file to have just the number
    if not(file_num in all_pmc_files):
        to_do.append(file_num)
        
random.shuffle(to_do)
to_do = to_do[:n]
print(to_do)    
        