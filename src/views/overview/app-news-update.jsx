import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";

import Box from "@mui/material/Box";
import Link from "@mui/material/Link";
import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import CardHeader from "@mui/material/CardHeader";

import Iconify from "src/components/iconify";
import Scrollbar from "src/components/scrollbar";

// ----------------------------------------------------------------------

const currencyList = [
  { code: "USD", name: "United States Dollar" },
  { code: "EUR", name: "Euro" },
  { code: "GBP", name: "British Pound Sterling" },
  { code: "JPY", name: "Japanese Yen" },
  { code: "AUD", name: "Australian Dollar" },
  { code: "CAD", name: "Canadian Dollar" },
  { code: "CHF", name: "Swiss Franc" },
  { code: "CNY", name: "Chinese Yuan" },
  { code: "SGD", name: "Singapore Dollar" },
  { code: "NZD", name: "New Zealand Dollar" },
];

// Utility: get flag icon URL by currency code (ISO country codes)
// Note: Some currencies represent multiple countries, but this is common practice.
// For example, USD -> US flag, EUR -> EU flag, GBP -> GB flag, etc.
const getFlagUrl = (code) => {
  const flagMap = {
    USD: "us",
    EUR: "eu",
    GBP: "gb",
    JPY: "jp",
    AUD: "au",
    CAD: "ca",
    CHF: "ch",
    CNY: "cn",
    SGD: "sg",
    NZD: "nz",
  };
  return `https://flagcdn.com/w40/${flagMap[code]}.png`; // 40px width flag
};

export default function AppNewsUpdate({ title, subheader, ...other }) {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchRates() {
      try {
        setLoading(true);
        const codes = currencyList.map((c) => c.code).join(",");
        const response = await fetch(
          `https://api.frankfurter.app/latest?from=INR&to=${codes}`
        );
        const data = await response.json();
        if (data.rates) {
          const invertedRates = currencyList.map(({ code, name }) => {
            const rate = data.rates[code] ? 1 / data.rates[code] : 0;
            return {
              id: code,
              image: getFlagUrl(code),
              title: `${code} - ${name}`,
              description: `1 ${code} = ${rate.toFixed(2)} INR`,
              postedAt: null,
            };
          });
          setList(invertedRates);
        } else {
          setError("Failed to fetch rates");
        }
      } catch {
        setError("Error fetching data");
      } finally {
        setLoading(false);
      }
    }

    fetchRates();
  }, []);

  if (loading) return <div>Loading currency rates...</div>;
  if (error) return <div>{error}</div>;

  return (
    <Card {...other}>
      <CardHeader title={title} subheader={subheader} />

      <Scrollbar>
        <Stack spacing={3} sx={{ p: 3, pr: 0 }}>
          {list.map((currency) => (
            <NewsItem key={currency.id} news={currency} />
          ))}
        </Stack>
      </Scrollbar>

      <Divider sx={{ borderStyle: "dashed" }} />

      <Box sx={{ p: 2, textAlign: "right" }}>
        <Button size="small" color="inherit" endIcon={<Iconify icon="eva:arrow-ios-forward-fill" />}>
          View all
        </Button>
      </Box>
    </Card>
  );
}

AppNewsUpdate.propTypes = {
  title: PropTypes.string,
  subheader: PropTypes.string,
};

// ----------------------------------------------------------------------

function NewsItem({ news }) {
  const { image, title, description } = news;

  return (
    <Stack direction="row" alignItems="center" spacing={2}>
      <Box
        component="img"
        alt={title}
        src={image}
        sx={{ width: 48, height: 32, borderRadius: 1.5, flexShrink: 0, objectFit: "cover" }}
      />

      <Box sx={{ minWidth: 240, flexGrow: 1 }}>
        <Link color="inherit" variant="subtitle2" underline="hover" noWrap>
          {title}
        </Link>

        <Typography variant="body2" sx={{ color: "text.secondary" }} noWrap>
          {description}
        </Typography>
      </Box>
    </Stack>
  );
}

NewsItem.propTypes = {
  news: PropTypes.shape({
    image: PropTypes.string,
    title: PropTypes.string,
    description: PropTypes.string,
  }),
};
