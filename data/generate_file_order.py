# -*- coding: utf-8 -*-
"""
Created on Thu Mar 15 14:00:36 2018

@author: Eric
"""

import glob
import random
import pandas as pd
import numpy as np

def more_work(n, user):
    all_txt = glob.glob("*.txt")
    all_pmc_files = set()
    # Gets all of the files that we have done into a set
    for txt in all_txt:
        file_data = np.genfromtxt(txt, dtype = int)
        for pmc_file in file_data:
            all_pmc_files.add(pmc_file)
            
    # Gets all of the PMC files
    pmcs = glob.glob("..\\..\\annotation_test\\*.html")       
    # Determines which PMC files we haven't done, and creates a list of N of them
    to_do = []
    for file in pmcs:
        loc = '..\\..\\annotation_test\\PMC'
        file_num = int(file.replace(loc, "").replace(".html", "")) # trim the file to have just the number
        if not(file_num in all_pmc_files):
            to_do.append(file_num)
            5
    random.shuffle(to_do)
    to_do = to_do[:n]
    
    for i in range(len(to_do)):
        print(to_do[i])    
       
    loc = ".//ordering_list_" + user + ".txt"
    done = np.loadtxt(loc, dtype = int)
    new_list = np.append(done, to_do)
    np.savetxt(loc, new_list)

        