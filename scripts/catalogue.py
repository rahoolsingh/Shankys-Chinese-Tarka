import requests
from PIL import Image
import shutil
import urllib
from PIL import Image
import os
import csv
# SKU,Category,Tag,Name,Price,Image,Description

csv_file = open('scripts/final.csv', 'r')

def write(code):
    output = open('code.txt', 'a', encoding="utf-8")
    output.writelines(code)
    output.close()

data = csv_file.read()
data = data.splitlines()
for i in range(151):
    product = data[i].split(',')
    filter = product[6]
    img_path = product[5]
    name = product[3]
    price = product[4]
    Category = product[1]
    tag=''
    if(product[2]==' veg '):
        tag='veg-tag'
    elif(product[2]=='non-veg'):
        tag='non-veg-tag'

    code = '''
<div class="col-md-4 filterDiv '''+filter+'''">
    <div class="card">
        <div class="card-upper">
            <div class="card-image">
                <img src="'''+img_path+'''" class="card-img-top" alt="...">
            </div>
            <div class="card-details">
                <h5 class="card-title">'''+name+'''</h5>
                <h6 class="card-price">Price: ₹'''+price+'''/-</h6>
                <p class="card-text '''+tag+'''">Category: '''+Category+'''</p>
            </div>
        </div>
        <div>
            <a href="" class="btn mr-2"><i class="fas  fa-shopping-cart"></i> Add To Cart</a>
        </div>
    </div>
</div>
'''

    write(str(code))
    # print(product)
    # input()

print('_________DONE_________')
