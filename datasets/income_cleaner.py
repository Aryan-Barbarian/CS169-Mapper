import pandas as pd
import json

original = pd.read_csv('./sample.csv')

original = original.loc[original["INCOME"] < 200000]
original.to_csv("./sample.csv", index=False)
