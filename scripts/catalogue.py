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
    img_path = product[5]
    name = product[3]
    price = product[4]
    Category = product[1]

    code = '''
<div class="col-md-4">
    <div class="card" style="width: 18rem;">
        <img src="'''+img_path+'''" class="card-img-top" alt="...">
        <div class="card-body">
            <h5 class="card-title">'''+name+'''</h5>
            <h6 class="card-price mb-2 ">Price: ₹'''+price+'''/-</h6>
            <p class="card-text">Category: '''+Category+'''</p>
            <a href="#" class="btn mr-2"><i class="fas  fa-shopping-cart"></i> Add To Cart</a </div>
        </div>
    </div>
</div>
'''

    write(str(code))
    # input()




print('_________DONE_________')


# img_path='www.google.com'
# name = 'Chicken Tikka';
# price = '200';
# tags = 'Chicken, Non-veg, Royal'

# code='''
# <div class="col-md-4">
#     <div class="card" style="width: 18rem;">
#         <img src="'''+img_path+'''" class="card-img-top" alt="...">
#         <div class="card-body">
#             <h5 class="card-title">'''+name+'''</h5>
#             <h6 class="card-price mb-2 ">Price: ₹'''+price+'''/-</h6>
#             <p class="card-text">Tags: +'''+Category+'''</p>
#             <a href="#" class="btn mr-2"><i class="fas  fa-shopping-cart"></i> Add To Cart</a </div>
#         </div>
#     </div>
# </div>
# '''

# print(code)
