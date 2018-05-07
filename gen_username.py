from random import randint
import numpy as np

save_location = "usernames.txt"
valid_user = ['lehmer16', 'byron_wallace']

# generates random usernames.
for i in range(0, 1000):
    valid_user.append(randint(9999, 100000))


np.savetxt(save_location, np.asarray(valid_user), delimiter = ',', fmt="%s")
