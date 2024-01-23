#!/bin/bash

git clone https://github.com/rinku122/stripe.git
cd stripe
cd payment_service
chmod +x updateModule.sh

# Define the modules to keep (accept multiple arguments)
modules_to_keep=("$@")

# If no arguments are provided, set modules_to_keep to all modules
if [ ${#modules_to_keep[@]} -eq 0 ]; then
  modules_to_keep=("RazorpayModule" "StripeModule" "PhonepayModule" "CoinbaseCommerceModule")
fi

# Define the file path
file_path="./src/app.module.ts"
packages_path="./package.json"

# Define the array of all modules with their corresponding folders
declare -A module_folders=(
  ["RazorpayModule"]="razorpay"
  ["StripeModule"]="stripe"
  ["PhonepayModule"]="phonepay"
  ["CoinbaseCommerceModule"]="coinbaseCommerce"
)

declare -A packages=(
  ["RazorpayModule"]="razorpay"
  ["StripeModule"]="stripe"
  ["CoinbaseCommerceModule"]="coinbase-commerce-node"
)

# Create a new array excluding the specified modules
new_modules=()
for module in "${!module_folders[@]}"
do
  if [[ ! " ${modules_to_keep[@]} " =~ " $module " ]]; then
    new_modules+=("$module")
  fi
done

# Display the new array
# echo "New array: ${new_modules[@]}"

# Loop through the new array, remove import lines, packages, and print each element with folder name
for module in "${new_modules[@]}"
do
  folder_name=${module_folders[$module]}
  package_name=${packages[$module]}

  # Remove module folder
  rm -rf "./src/$folder_name"

  # Remove import lines from app.module.ts
  sed -i "/${module}/d" $file_path
  # echo "Module: $module, Folder: $folder_name"

  # Remove package from package.json
  if [ -n "$package_name" ]; then
    npm uninstall --save $package_name
    # echo "Package: $package_name removed from package.json"
  fi
done

cd ..
echo "Getting RabbitMq..."
docker-compose up -d
cd payment_service
echo "Installing Dependencies..."
npm i 
mv config.env .env

echo -e "\e[;33m1. Navigate to the 'stripe' directory\e[0m"
echo -e "\e[1;33m cd stripe\e[0m"

echo -e "\e[;33m2. Navigate to the 'payment_service' directory\e[0m"
echo -e "\e[1;33m cd payment_service\e[0m"

echo -e "\e[;33m3. Update env according to modules needed. No need for all credentials.\e[0m"


echo -e "\e[;33m4. Start development server.\e[0m"
echo -e "\e[1;33m npm run start:dev\e[0m"


