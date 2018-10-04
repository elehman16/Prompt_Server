# -*- coding: utf-8 -*-
"""
Created on Thu Jun 21 17:40:22 2018

@author: Eric
"""
import pandas as pd
import numpy as np

def merge(name):
    new = '.\\all_outputs\\new_out_' + name + '.csv'
    to_be = '.\\all_outputs\\out_' + name + '.csv'
    old = '.\\all_outputs\\old_out_' + name + '.csv'
    
    # read in first data
    dfo = pd.read_csv(old, header = None, na_values= "", engine = 'python')
    dfo.fillna("", inplace=True)
    dfo = np.asarray(dfo)
    
    # read in second data
    dfn = pd.read_csv(new, header = None, na_values= "", engine = 'python')
    dfn.fillna("", inplace=True)
    dfn = np.asarray(dfn)
    
    # New data formating
    dfo = np.append(dfo, dfn[len(dfo) - 1:], axis = 0)
    
    df = pd.DataFrame(data=dfo[1:], columns=dfo[0]) 
                 
    df.to_csv(to_be, index = False)
    return None
    
    
names = ['krystie', 'sergii']
#names = ['sergii']
for n in names:
    merge(n)

             