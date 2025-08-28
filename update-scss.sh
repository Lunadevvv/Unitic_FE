#!/bin/bash

# Script to update SCSS files to use base variables
# Run this from the project root directory

echo "🎨 Updating SCSS files to use base variables..."

# Define color replacements (hard-coded color -> base variable)
declare -A color_replacements=(
    ["#667eea"]="base.\$gradient-purple-blue"
    ["#764ba2"]="base.\$gradient-purple-blue"
    ["linear-gradient(135deg, #667eea 0%, #764ba2 100%)"]="base.\$gradient-purple-blue"
    ["#52c41a"]="base.\$status-active"
    ["#73d13d"]="base.\$status-active" 
    ["linear-gradient(135deg, #52c41a, #73d13d)"]="base.\$gradient-green"
    ["#faad14"]="base.\$status-pending"
    ["#ffc53d"]="base.\$status-pending"
    ["linear-gradient(135deg, #faad14, #ffc53d)"]="base.\$gradient-yellow"
    ["#1890ff"]="base.\$primary-color"
    ["#40a9ff"]="base.\$primary-color"
    ["linear-gradient(135deg, #1890ff, #40a9ff)"]="base.\$gradient-blue"
    ["#ff4d4f"]="base.\$status-expired"
    ["#f5222d"]="base.\$status-cancelled"
    ["#666"]="base.\$text-secondary"
    ["#999"]="base.\$text-muted"
    ["#262626"]="base.\$text-color"
    ["#fafafa"]="base.\$background-light"
    ["#f6ffed"]="base.\$success-light"
    ["#f0f7ff"]="base.\$info-light"
    ["#f0f0f0"]="base.\$border-light"
    ["#fff7e6"]="base.\$warning-light"
    ["#d48806"]="base.\$warning-text"
    ["white"]="base.\$white-1"
    ["rgba(255, 255, 255, 0.9)"]="rgba(base.\$white-1, 0.9)"
    ["rgba(0, 0, 0, 0.3)"]="rgba(base.\$dark-bg, 0.3)"
    ["rgba(0, 0, 0, 0.1)"]="rgba(base.\$dark-bg, 0.1)"
    ["rgba(0, 0, 0, 0.15)"]="rgba(base.\$dark-bg, 0.15)"
    ["12px"]="base.\$border-radius"
    ["0.3s"]="base.\$transition-speed"
)

# Files to update (excluding _base.scss itself)
scss_files=(
    "src/assets/scss/MyEventsPage.scss"
    "src/assets/scss/EventDetail.scss"
    "src/assets/scss/EventPage.scss"
    "src/assets/scss/EventCard.scss"
    "src/assets/scss/CategoryTabs.scss"
    "src/assets/scss/EventFilter.scss"
    "src/assets/scss/Cart.scss"
    "src/assets/scss/CheckoutPage.scss"
    "src/assets/scss/UserProfilePage.scss"
    "src/assets/scss/OrganizationRegisterEventPage.scss"
    "src/assets/scss/OrganizationEventList.scss"
    "src/assets/scss/EventManagementPage.scss"
    "src/assets/scss/DashboardPage.scss"
    "src/assets/scss/ReportsPage.scss"
    "src/assets/scss/UserManagementPage.scss"
    "src/assets/scss/OrderManagementPage.scss"
    "src/assets/scss/TicketManagementPage.scss"
)

for file in "${scss_files[@]}"; do
    if [ -f "$file" ]; then
        echo "📝 Updating $file..."
        
        # Add @use 'base'; at the top if not present
        if ! grep -q "@use 'base'" "$file"; then
            sed -i '' '1i\
@use '\''base'\'';
' "$file"
        fi
        
        # Replace hard-coded values with base variables
        for find in "${!color_replacements[@]}"; do
            replace="${color_replacements[$find]}"
            # Use | as delimiter to avoid conflicts with common characters
            sed -i '' "s|$find|$replace|g" "$file"
        done
        
        echo "✅ Updated $file"
    else
        echo "⚠️  File not found: $file"
    fi
done

echo "🎉 SCSS files updated to use base variables!"
echo "📋 Summary:"
echo "   - Added @use 'base' imports"
echo "   - Replaced hard-coded colors with base variables" 
echo "   - Standardized border-radius and transitions"
echo ""
echo "💡 Manual review recommended for complex gradients and rgba values"
