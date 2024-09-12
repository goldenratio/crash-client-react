echo "generate schema!"
if ! command -v flatc &> /dev/null
then
    echo "flatc could not be found!"
    exit 1
fi

flatc --version
flatc --ts -o src/gen game_schema.fbs

# Define the directory to start searching from
DIRECTORY="src/gen"

# Find all .ts files recursively in the specified directory
find "$DIRECTORY" -type f -name "*.ts" | while read -r file; do
    # Check if the first line is already the nocheck comment
    first_line=$(head -n 1 "$file")
    if [ "$first_line" != "// @ts-nocheck" ]; then
        # Prepend the nocheck comment to the file
        echo "Prepending // @ts-nocheck to $file"
        (echo "// @ts-nocheck"; cat "$file") > "$file.tmp" && mv "$file.tmp" "$file"
    else
        echo "$file already has // @ts-nocheck"
    fi
done
